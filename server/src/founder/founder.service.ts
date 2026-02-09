import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Founder, FounderDocument } from './entities/founder.entity';
import { CreateFounderDto } from './dto/create-founder.dto';
import * as bcrypt from 'bcrypt';
import { FounderResponse } from './types/founder-response';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateFounderDto } from './dto/update-founder.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import { UpdatePasswordDto } from './dto/update-password-dto';


@Injectable()
export class FounderService {
  constructor(
    @InjectModel(Founder.name) private founderModel: Model<FounderDocument>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}
  
  async signup(createFounderDto: CreateFounderDto): Promise<FounderResponse> {
    const { name, email, password, phone } = createFounderDto;

    //Check for existing user
    const existingEmail = await this.founderModel.findOne({ email});
    if (existingEmail) {
      throw new ConflictException('Email is already in use');
    }

    //Check for existing name
    const existingName = await this.founderModel.findOne({ name });
    if (existingName) {
      throw new ConflictException('Name is already in use');
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create founder
    const founder = await this.founderModel.create({
      name, 
      email, 
      password: hashedPassword,
      phone
    });

    //return saved founder
    return {
      id: founder._id.toString(),
      name: founder.name,
      email:founder.email,
      createdAt: founder.createdAt,
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
      
    const user = await this.founderModel.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.googleId && !user.password) {
      throw new UnauthorizedException(
        'This account was created with Google. Please log in with Google.'
      );
    }
      
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new UnauthorizedException('JWT configuration error');
    }
  
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      jwtSecret,
      { expiresIn: '24h' }
    );
  
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        tier: user.tier,
      },
    };
  }
  
  async getUserProfile(userId: string) {
    const user = await this.founderModel.findById(userId).select('-password');

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;       
  }

  async updateProfile(userId: string, updateFounderDto: UpdateFounderDto): Promise<FounderResponse> {
    const { name, email, phone } = updateFounderDto;

    const user = await this.founderModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check for duplicate email
    if (email && email !== user.email) {
      const existingEmail = await this.founderModel.findOne({ email });
      if (existingEmail) {
        throw new ConflictException('Email is already in use');
      }
      user.email = email;
    }

    // Check for duplicate name
    if (name && name !== user.name) {
      const existingName = await this.founderModel.findOne({ name });
      if (existingName) {
        throw new ConflictException('Name is already in use');
      }
      user.name = name;
    }

    if (phone) {
      user.phone = phone;
    }

    const updatedUser = await user.save();

    return {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
    };
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<{ message: string }> {
    const { oldPassword, newPassword } = updatePasswordDto;

    const user = await this.founderModel.findById(userId).select('+password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password does not match');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password updated successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    
    const user = await this.founderModel.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return { message: 'If the email exists, a password reset link has been sent.' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to user
    await this.founderModel.findByIdAndUpdate(
      user._id,
      {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry
      },
      { runValidators: false }
    );

    // Send reset email
    try {
      await this.mailService.sendPasswordResetEmail(email, resetToken);
      return { message: 'If the email exists, a password reset link has been sent.' };
    } catch (error) {
      console.error('Failed to send reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    const user = await this.founderModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await this.founderModel.findByIdAndUpdate(
      user._id, 
      {
        password: hashedPassword,
        $unset: {
          resetPasswordToken: 1,
          resetPasswordExpires: 1
        }
      },
      { runValidators: false }
    );

    return { message: 'Password has been reset successfully' };
  }

  async getTrialStatus(userId: string) {
    const founder = await this.founderModel.findById(userId);
    if (!founder) throw new NotFoundException('Founder not found');

    if (founder.tier === "lifetime") {
      return { tier: 'lifetime', expired: false, daysRemaining: 999999 }
    }

    const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
    const expiryDate = new Date(founder.trialStartDate.getTime() + TRIAL_DURATION_MS);
    const now = new Date();

    const diffTime = expiryDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const isExpired = now > expiryDate;

    return {
      tier: founder.tier,
      expired: isExpired,
      daysRemaining: daysRemaining,
      expiryDate: expiryDate
    };
  }
}
