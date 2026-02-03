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
}