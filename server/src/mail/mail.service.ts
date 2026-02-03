import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SibApiV3Sdk from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;
  private readonly senderEmail = "mahderhawaz16@gmail.com";
  private readonly senderName = "Warm Introduction Assistant";

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      apiKey || '',
    );
  }

  // --- 1. Password Reset (The one we just fixed) ---
  async sendPasswordResetEmail(targetEmail: string, token: string) {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    sendSmtpEmail.subject = "Reset Your Password - Warmly Intro";
    sendSmtpEmail.htmlContent = `<html><body><p>Click <a href="${resetLink}">here</a> to reset your password.</p></body></html>`;
    sendSmtpEmail.sender = { name: this.senderName, email: this.senderEmail };
    sendSmtpEmail.to = [{ email: targetEmail }];

    return this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }

  // --- 2. Contact Form (Fixes Error 1) ---
  async sendContactEmail(name: string, email: string, message: string) {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    const receiverEmail = this.configService.get<string>('CONTACT_RECEIVER_EMAIL') || this.senderEmail;

    sendSmtpEmail.subject = `New Contact Form from ${name}`;
    sendSmtpEmail.htmlContent = `<html><body><p><strong>From:</strong> ${email}</p><p>${message}</p></body></html>`;
    sendSmtpEmail.sender = { name: this.senderName, email: this.senderEmail };
    sendSmtpEmail.to = [{ email: receiverEmail }];

    return this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }

  // --- 3. Generated Intro Email (Fixes Error 2 & 3) ---
  async sendGeneratedIntroEmail(options: { investorEmail: string; startupName: string; generatedIntro: string }) {
    const { investorEmail, startupName, generatedIntro } = options;
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = `Warm Intro from ${startupName}`;
    sendSmtpEmail.htmlContent = `<div style="font-family: Arial;">${generatedIntro}</div>`;
    sendSmtpEmail.sender = { name: this.senderName, email: this.senderEmail };
    sendSmtpEmail.to = [{ email: investorEmail }];

    try {
      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return { success: true, result };
    } catch (error) {
      throw new BadRequestException("Failed to send intro email.");
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