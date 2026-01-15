// src/mail/mail.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

@Injectable()
export class MailService {
  private resend: Resend;
  private brevoApi: SibApiV3Sdk.TransactionalEmailsApi;
  private brevoFromEmail: string;
  private brevoFromName: string;

  constructor(private readonly configService: ConfigService) {
    // --- Initialize Resend ---
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!resendApiKey) throw new Error('RESEND_API_KEY is missing');
    this.resend = new Resend(resendApiKey);

    // --- Initialize Brevo Transactional API ---
    const brevoApiKey = this.configService.get<string>('BREVO_API_KEY');
    if (!brevoApiKey) throw new Error('BREVO_API_KEY is missing');

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = brevoApiKey;

    this.brevoApi = new SibApiV3Sdk.TransactionalEmailsApi();
    this.brevoFromEmail = this.configService.get<string>('BREVO_FROM_EMAIL')!;
    this.brevoFromName = this.configService.get<string>('BREVO_FROM_NAME')!;

    if (!this.brevoFromEmail || !this.brevoFromName) {
      throw new Error('Missing BREVO_FROM_EMAIL or BREVO_FROM_NAME');
    }
  }

  // --- Resend: Contact Form ---
  async sendContactEmail(name: string, email: string, message: string) {
    const fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL');
    const toEmail = this.configService.get<string>('CONTACT_RECEIVER_EMAIL');
    if (!fromEmail || !toEmail) throw new Error('Missing RESEND_FROM_EMAIL or CONTACT_RECEIVER_EMAIL');

    return this.resend.emails.send({
      from: `Warm Intro Contact <${fromEmail}>`,
      to: [toEmail],
      subject: 'Contact Form Submission',
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });
  }

  // --- Resend: Password Reset ---
  async sendPasswordResetEmail(email: string, resetToken: string) {
    const fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL');
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    if (!fromEmail) throw new Error('Missing RESEND_FROM_EMAIL');

    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    return this.resend.emails.send({
      from: `Warm Introduction Assistant <${fromEmail}>`,
      to: [email],
      subject: 'Password Reset Request',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0347D2;">Password Reset Request</h2>
        <p>You requested a password reset for your Warm Introduction Assistant account.</p>
        <p><a href="${resetUrl}" style="background-color: #0347D2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
        <p>Or copy and paste this link in your browser: ${resetUrl}</p>
        <p style="color: #666; font-size: 14px;">This link will expire in 1 hour. If you didn't request this reset, ignore this email.</p>
      </div>`,
    });
  }

  // --- Brevo: Intro Emails ---
  async sendGeneratedIntroEmail(options: {
    investorEmail: string;
    startupName: string;
    generatedIntro: string;
  }) {
    const { investorEmail, startupName, generatedIntro } = options;

    if (!investorEmail) throw new BadRequestException("Investor email is required.");
    if (!startupName) throw new BadRequestException("Startup name is required.");
    if (!generatedIntro) throw new BadRequestException("Generated intro text is required.");

    const subject = `Warm Intro from ${startupName} startup`;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: this.brevoFromName,
      email: this.brevoFromEmail,
    };
    sendSmtpEmail.to = [{ email: investorEmail }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
      ${generatedIntro}
    </div>`;

    try {
      const result = await this.brevoApi.sendTransacEmail(sendSmtpEmail);

      return {
        success: true,
        message: "Intro email sent successfully to investor.",
        result,
      };
    } catch (error) {
      console.error("Investor intro email failed:", error);
      throw new BadRequestException("Failed to send investor intro email.");
    }
  }
}