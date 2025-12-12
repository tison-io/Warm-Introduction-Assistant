import { Test, TestingModule } from '@nestjs/testing';
import { FounderService } from './founder.service';
import { getModelToken } from '@nestjs/mongoose';
import { Founder } from './entities/founder.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateFounderDto } from './dto/create-founder.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateFounderDto } from './dto/update-founder.dto';
import * as jsonwebtoken from 'jsonwebtoken';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('jwt_token'),
  verify: jest.fn(),
}));

describe('FounderService', () => {
  let service: FounderService;
  let mockFounderModel: any;
  let mockConfigService: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockFounderModel = {
      findOne: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FounderService,
        { provide: getModelToken(Founder.name), useValue: mockFounderModel },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<FounderService>(FounderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should throw ConflictException if email exists', async () => {
      mockFounderModel.findOne.mockResolvedValueOnce({ _id: '1', email: 'test@test.com' });
      const dto: CreateFounderDto = { name: 'Test', email: 'test@test.com', password: 'pass', phone: '123' };
      await expect(service.signup(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if name exists', async () => {
      mockFounderModel.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ _id: '1', name: 'Test' });
      const dto: CreateFounderDto = { name: 'Test', email: 'new@test.com', password: 'pass', phone: '123' };
      await expect(service.signup(dto)).rejects.toThrow(ConflictException);
    });

    it('should create founder and return FounderResponse', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      mockFounderModel.findOne.mockResolvedValue(null);
      mockFounderModel.create.mockResolvedValue({
        _id: '1',
        name: 'Test',
        email: 'test@test.com',
        password: 'hashed_password',
        createdAt: new Date(),
      });
      const dto: CreateFounderDto = { name: 'Test', email: 'test@test.com', password: 'pass', phone: '123' };
      const result = await service.signup(dto);
      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('name', 'Test');
      expect(result).toHaveProperty('email', 'test@test.com');
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = { email: 'test@test.com', password: 'pass' };

    it('should throw UnauthorizedException if user not found', async () => {
      mockFounderModel.findOne.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      mockFounderModel.findOne.mockResolvedValue({ _id: '1', email: 'test@test.com', password: 'hashed', name: 'Test' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return token and user if login succeeds', async () => {
      const loginDto = { email: 'test@test.com', password: 'pass' };
      const mockUser = { _id: '1', email: 'test@test.com', password: 'hashed', name: 'Test' };

      mockFounderModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      mockConfigService.get.mockReturnValue('secret');
      (jsonwebtoken.sign as jest.Mock).mockReturnValue('jwt_token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        token: 'jwt_token',
        user: { id: '1', name: 'Test', email: 'test@test.com' },
      });
      expect(jsonwebtoken.sign).toHaveBeenCalled();
    });
  });

  describe('getUserProfile', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockFounderModel.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
      await expect(service.getUserProfile('1')).rejects.toThrow(UnauthorizedException);
    });

    it('should return user profile if found', async () => {
      const mockUser = { _id: '1', name: 'Test', email: 'test@test.com' };
      mockFounderModel.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
      const result = await service.getUserProfile('1');
      expect(result).toBe(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const mockUser: any = { 
        _id: '1', name: 'Old', email: 'old@test.com', phone: '123', save: jest.fn().mockResolvedValue({
          _id: '1', name: 'New', email: 'new@test.com', createdAt: new Date()
        }), password: 'hashed' 
      };
      mockFounderModel.findById.mockResolvedValue(mockUser);
      mockFounderModel.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed');

      const dto: UpdateFounderDto = { name: 'New', email: 'new@test.com', phone: '321', password: 'pass' };
      const result = await service.updateProfile('1', dto);

      expect(mockUser.save).toHaveBeenCalled();
      expect(result.name).toBe('New');
      expect(result.email).toBe('new@test.com');
    });
  });
});