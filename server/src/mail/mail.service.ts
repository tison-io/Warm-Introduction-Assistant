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

  // --- Brevo: Password Reset ---
  async sendPasswordResetEmail(targetEmail: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Reset Your Password - Warm Intro";
    sendSmtpEmail.htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password for your Warm Intro account.</p>
          <p>Click the link below to set a new password:</p>
          <p><a href="${resetLink}" style="color: #0347D2; font-weight: bold;">Reset Password</a></p>
          <p>If you did not request this, please ignore this email.</p>
        </body>
      </html>`;
    
    sendSmtpEmail.sender = { 
      name: this.brevoFromName, 
      email: this.brevoFromEmail 
    };
    sendSmtpEmail.to = [{ email: targetEmail }];

    try {
      const result = await this.brevoApi.sendTransacEmail(sendSmtpEmail);
      return result;
    } catch (error) {
      console.error('Brevo Password Reset Error:', error.response?.body || error.message);
      throw new BadRequestException("Failed to send password reset email via Brevo.");
    }
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

  // --- Brevo: Worspace Invitation Emails ---
  async sendWorkspaceInvite(email: string, workspaceName: string, inviterName: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const inviteUrl = `${frontendUrl}/accept-invite?token=${token}`;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.sender = {
      name: this.brevoFromName,
      email: this.brevoFromEmail,
    };
    
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.subject = `Invitation to join ${workspaceName} on Warm Intro`;
    
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; padding: 20px; border-radius: 8px;">
        <h2 style="color: #0347D2; text-align: center;">Workspace Invitation</h2>
        <p>Hi there,</p>
        <p><strong>${inviterName}</strong> has invited you to join the <strong>${workspaceName}</strong> workspace on the Warm Introduction Assistant.</p>
        <p>Collaborate with your team to manage startup blurbs, pitch decks, and warm introductions.</p>
        
        <div style="margin: 35px 0; text-align: center;">
          <a href="${inviteUrl}" style="background-color: #0347D2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Accept Invitation</a>
        </div>
        
        <p style="color: #666; font-size: 14px;">If the button above doesn't work, copy and paste this link into your browser:</p>
        <p style="color: #0347D2; font-size: 12px; word-break: break-all;">${inviteUrl}</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">This invitation was sent via Warm Introduction Assistant.</p>
      </div>
    `;

    try {
      const result = await this.brevoApi.sendTransacEmail(sendSmtpEmail);
      return result;
    } catch (error) {
      console.error('Brevo Workspace Invite Error:', error.response?.body || error.message);
      throw new BadRequestException("Failed to send workspace invitation email via Brevo.");
    }
  }
}