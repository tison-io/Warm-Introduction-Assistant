// mail.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY', '');
    if (!apiKey) throw new Error('RESEND_API_KEY is missing');
    this.resend = new Resend(apiKey);
  }

  async sendContactEmail(name: string, email: string, message: string) {
    const fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL', '');
    const toEmail = this.configService.get<string>('CONTACT_RECEIVER_EMAIL', '');

    if (!fromEmail || !toEmail) {
      throw new Error('Missing RESEND_FROM_EMAIL or CONTACT_RECEIVER_EMAIL');
    }

    try {
      const data = await this.resend.emails.send({
        from: `Warm Intro Contact <${fromEmail}>`,
        to: [toEmail],
        subject: 'Contact Form Submission',
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });

      return data;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL', '');
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

    if (!fromEmail) {
      throw new Error('Missing RESEND_FROM_EMAIL');
    }

    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      const data = await this.resend.emails.send({
        from: `Warm Introduction Assistant <${fromEmail}>`,
        to: [email],
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0347D2;">Password Reset Request</h2>
            <p>You requested a password reset for your Warm Introduction Assistant account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #0347D2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p style="color: #666; font-size: 14px;">This link will expire in 1 hour. If you didn't request this reset, please ignore this email.</p>
          </div>
        `,
      });

      return data;
    } catch (error) {
      console.error('Password reset email sending failed:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}
