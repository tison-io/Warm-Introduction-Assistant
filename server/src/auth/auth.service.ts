import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Founder, FounderDocument } from '../founder/entities/founder.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Founder.name) private founderModel: Model<FounderDocument>,
        private jwtService: JwtService,
    ) {}

    async validateSocialUser(profile: { googleId:string; email:string; name:string; }): Promise<FounderDocument> {
        let user = await this.founderModel.findOne({ googleId: profile.googleId});

        if (!user) {
            user = await this.founderModel.findOne({ email:profile.email });
        }

        if (user && !user.googleId) {
            user.googleId = profile.googleId;
            await user.save();
        }

        if (!user) {
            user = await this.founderModel.create({
                googleId: profile.googleId,
                email:profile.email,
                name:profile.name,
                tier: 'trial',
            });
        }

        return user;
    }

    generateJwt(user: FounderDocument) {
        const payload = { userId: user._id, email: user.email };
        const token = this.jwtService.sign(payload);
        return{ 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                tier: user.tier,
            }
        }
    }
} 