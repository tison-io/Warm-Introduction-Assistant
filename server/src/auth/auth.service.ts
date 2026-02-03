import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Founder, FounderDocument } from '../founder/entities/founder.entity';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Founder.name) private founderModel: Model<FounderDocument>,
        private jwtService: JwtService,
        private mailService: MailService,
    ) {}

    // 1. Social Login Logic
    async validateSocialUser(profile: { googleId: string; email: string; name: string; }): Promise<FounderDocument> {
        let user = await this.founderModel.findOne({ googleId: profile.googleId });

        if (!user) {
            user = await this.founderModel.findOne({ email: profile.email });
        }

        if (user && !user.googleId) {
            user.googleId = profile.googleId;
            await user.save();
        }

        if (!user) {
            user = await this.founderModel.create({
                googleId: profile.googleId,
                email: profile.email,
                name: profile.name,
            });
        }

        return user;
    }

    // 2. Forgot Password Logic
    async forgotPassword(email: string) {
        const user = await this.founderModel.findOne({ email });

        // Security: Don't tell the user if the email doesn't exist
        if (!user) {
            return { message: 'If an account exists, a reset link has been sent.' };
        }

        // Generate Token
        const token = crypto.randomBytes(20).toString('hex');

        // Save to Founder record
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        // Send Email via Brevo
        try {
            await this.mailService.sendPasswordResetEmail(user.email, token);
            return { message: 'If an account exists, a reset link has been sent.' };
        } catch (error) {
            console.error('Email sending failed:', error);
            throw new Error('Email service currently unavailable');
        }
    }

    // 3. JWT Generation (Fixes your Controller error)
    generateJwt(user: FounderDocument) {
        const payload = { userId: user._id, email: user.email };
        const token = this.jwtService.sign(payload);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        };
    }
}