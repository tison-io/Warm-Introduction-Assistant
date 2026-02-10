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
    // --- Initialize Resend
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!resendApiKey) throw new Error('RESEND_API_KEY is missing');
    this.resend = new Resend(resendApiKey);

    // --- Initialize Brevo Transactional API
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

  // --- Resend: Contact Form
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

  // --- Brevo: Password Reset
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

  // ---Brevo: Consent Emails
  async sendConsentEmail(options: {
    recipients: { email: string; name: string }[];
    startupName: string;
    otherPersonName: string;
    consentBody: string;
    approvalUrl: string;
  }) {
    const { recipients, startupName, consentBody, approvalUrl } = options;

    const validRecipients = recipients.filter(r => r.email && r.email.includes('@'));

    if (validRecipients.length === 0) {
      throw new Error("No valid recipients provided");
    }

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: this.brevoFromName, email: this.brevoFromEmail };

    sendSmtpEmail.to = validRecipients.map(r => ({ email: r.email, name: r.name }));

    sendSmtpEmail.messageVersions = recipients.map(r => ({
      to: [{ 
        email: r.email.trim().toLowerCase(), 
        name: r.name 
      }],
      params: { 
        personalizedUrl: `${approvalUrl}&email=${encodeURIComponent(r.email.trim())}` 
      }
    }));
    
    sendSmtpEmail.subject = `Action Required: Intro regarding ${startupName}`;

    sendSmtpEmail.htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="padding: 20px;">
          <p>Hi there,</p>
          <p>${consentBody}</p>
          <p>If you're open to this connection, click the button below and I'll send over the formal intro. If you're too busy right now, no worries at all!</p>
        </div>
        
        <div style="background-color: #f4f7ff; border-top: 2px solid #0347D2; padding: 24px; text-align: center;">
          <p style="margin-top: 0; font-size: 14px; color: #555; font-weight: bold;">Warm Intro Assistant</p>
          <p style="font-size: 12px; color: #777; margin-bottom: 20px;">This request was generated to save you time. Please confirm your interest below:</p>
          
          <a href="{{params.personalizedUrl}}" 
            style="background-color: #0347D2; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(3, 71, 210, 0.2);">
            Confirm & Approve Intro
          </a>
          
          <p style="font-size: 11px; color: #999; margin-top: 20px;">
            By clicking approve, the community manager will be notified to finalize the introduction thread.
          </p>
        </div>
      </div>
    `;

    return await this.brevoApi.sendTransacEmail(sendSmtpEmail);
  }

  // --- Brevo: Intro Emails
  async sendGeneratedIntroEmail(options: {
    investorEmail: string;
    investorName: string;
    founderEmail: string;
    founderName: string;
    startupName: string;
    generatedIntro: string;
  }) {
    const { investorEmail, investorName, founderEmail, founderName, startupName, generatedIntro } = options;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: this.brevoFromName, email: this.brevoFromEmail };
    
    sendSmtpEmail.to = [
      { email: investorEmail, name: investorName },
      { email: founderEmail, name: founderName }
    ];

    sendSmtpEmail.subject = `Intro: ${founderName} (${startupName}) <> ${investorName}`;

    sendSmtpEmail.htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
        <p>Hi ${founderName} and ${investorName},</p>
        
        <p>I'm pleased to connect you both! As we discussed, you both expressed interest in this introduction.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #0347D2; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #0347D2;">The Context</h4>
          <p style="font-style: italic;">${generatedIntro}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p><strong>${founderName} (${startupName}):</strong> A founder building in this space with a focus on scaling high-impact solutions.</p>
          <p><strong>${investorName}:</strong> An experienced partner looking for innovative startups like ${startupName}.</p>
        </div>

        <p>I'll let you two take it on from here!.</p>
      </div>
    `;

    /* // Move the community manager to BCC
    sendSmtpEmail.bcc = [{ email: this.brevoFromEmail, name: this.brevoFromName }];  To add this later*/

    try {
      return await this.brevoApi.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error("Final Intro Email Failed:", error.response?.body || error.message);
      throw new BadRequestException("Failed to send the final introduction email.");
    }
  }

  // --- Brevo: Worspace Invitation Emails
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