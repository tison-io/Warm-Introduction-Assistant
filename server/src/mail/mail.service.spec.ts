import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { Resend } from 'resend';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn(),
      },
    })),
  };
});

jest.mock('sib-api-v3-sdk', () => {
  const mApi = {
    sendTransacEmail: jest.fn(),
  };
  return {
    ApiClient: {
      instance: {
        authentications: { 'api-key': { apiKey: '' } },
      },
    },
    TransactionalEmailsApi: jest.fn(() => mApi),
    SendSmtpEmail: jest.fn().mockImplementation(() => ({})),
  };
});

describe('MailService', () => {
  let service: MailService;
  let configService: ConfigService;
  let mockBrevoApi: any;

  const mockConfig = {
    get: jest.fn((key: string) => {
      const config = {
        RESEND_API_KEY: 're_123',
        BREVO_API_KEY: 'xkeysib-123',
        BREVO_FROM_EMAIL: 'hello@example.com',
        BREVO_FROM_NAME: 'Warm Intro',
        RESEND_FROM_EMAIL: 'outbound@example.com',
        CONTACT_RECEIVER_EMAIL: 'admin@example.com',
        FRONTEND_URL: 'http://localhost:3000',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
    mockBrevoApi = (service as any).brevoApi;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendContactEmail', () => {
    it('should call resend.emails.send with correct parameters', async () => {
      const sendSpy = (service as any).resend.emails.send;
      sendSpy.mockResolvedValue({ id: '123' });
      
      await service.sendContactEmail('John Doe', 'john@test.com', 'Hello!');

      expect(sendSpy).toHaveBeenCalledWith(expect.objectContaining({
        to: ['admin@example.com'],
        subject: 'Contact Form Submission',
      }));
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should successfully send a password reset email', async () => {
      mockBrevoApi.sendTransacEmail.mockResolvedValue({ messageId: 'brevo-123' });

      const result = await service.sendPasswordResetEmail('user@test.com', 'token123');

      expect(result).toBeDefined();
      expect(mockBrevoApi.sendTransacEmail).toHaveBeenCalled();
    });

    it('should throw BadRequestException if Brevo fails', async () => {
      mockBrevoApi.sendTransacEmail.mockRejectedValue(new Error('Brevo Error'));

      await expect(service.sendPasswordResetEmail('user@test.com', 'token123'))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('sendConsentEmail', () => {
    it('should throw error if no valid recipients are provided', async () => {
      await expect(service.sendConsentEmail({
        recipients: [{ email: 'invalid-email', name: 'Bad' }],
        startupName: 'TechCo',
        otherPersonName: 'Alice',
        consentBody: 'Body',
        approvalUrl: 'http://link.com'
      })).rejects.toThrow('No valid recipients provided');
    });

    it('should call Brevo with mapped recipients and message versions', async () => {
      mockBrevoApi.sendTransacEmail.mockResolvedValue({ messageId: 'consent-123' });

      await service.sendConsentEmail({
        recipients: [{ email: 'investor@test.com', name: 'Bob' }],
        startupName: 'TechCo',
        otherPersonName: 'Alice',
        consentBody: 'Body',
        approvalUrl: 'http://link.com'
      });

      expect(mockBrevoApi.sendTransacEmail).toHaveBeenCalled();
    });
  });
});