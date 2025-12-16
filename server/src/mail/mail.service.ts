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
}
