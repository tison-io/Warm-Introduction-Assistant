import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { FounderService } from './founder.service';
import { Founder } from './entities/founder.entity';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

// Mock bcrypt
jest.mock('bcrypt');

describe('FounderService', () => {
  let service: FounderService;
  let model: any;
  let mailService: MailService;

  const mockFounder = {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    tier: 'trial',
    trialStartDate: new Date(),
    save: jest.fn().mockResolvedValue(this),
  };

  const mockFounderModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const mockMailService = {
    sendPasswordResetEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FounderService,
        { provide: getModelToken(Founder.name), useValue: mockFounderModel },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('secret') } },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('token') } },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<FounderService>(FounderService);
    model = module.get(getModelToken(Founder.name));
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should successfully create a new founder', async () => {
      const dto = { name: 'John', email: 'j@j.com', password: '123', phone: '123' };
      model.findOne.mockReturnValue(null); // No existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      model.create.mockResolvedValue({ ...mockFounder, ...dto, _id: { toString: () => 'id' } });

      const result = await service.signup(dto);

      expect(model.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(dto.email);
    });

    it('should throw ConflictException if email exists', async () => {
      model.findOne.mockReturnValue(mockFounder);
      await expect(service.signup({ email: 'test@test.com' } as any))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const loginDto = { email: 'john@example.com', password: 'password123' };
      
      // Setup chain: model.findOne().select()
      model.findOne.mockReturnValue({
        select: jest.fn().mockReturnValue(mockFounder),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(mockFounder.email);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      model.findOne.mockReturnValue({ select: jest.fn().mockReturnValue(mockFounder) });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: 'j@j.com', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('should call mailService if user exists', async () => {
      model.findOne.mockReturnValue(mockFounder);
      model.findByIdAndUpdate.mockResolvedValue(true);
      mailService.sendPasswordResetEmail = jest.fn().mockResolvedValue(undefined);

      const result = await service.forgotPassword({ email: 'john@example.com' });

      expect(mailService.sendPasswordResetEmail).toHaveBeenCalled();
      expect(result.message).toContain('password reset link has been sent');
    });
  });
});