import { Test, TestingModule } from '@nestjs/testing';
import { FounderController } from './founder.controller';
import { FounderService } from './founder.service';
import { CreateFounderDto } from './dto/create-founder.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateFounderDto } from './dto/update-founder.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

// Mock the entire FounderService
const mockFounderService = {
  signup: jest.fn(),
  login: jest.fn(),
  socialLogin: jest.fn(),
  socialSignup: jest.fn(),
  getUserProfile: jest.fn(),
  updateProfile: jest.fn(),
};

// Mock the JwtAuthGuard to allow testing the route without full authentication setup
const mockJwtAuthGuard = {
  canActivate: (context: ExecutionContext) => true,
};

describe('FounderController', () => {
  let controller: FounderController;
  let service: typeof mockFounderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FounderController],
      providers: [
        {
          provide: FounderService,
          useValue: mockFounderService,
        },
      ],
    })
      // Override the JwtAuthGuard to use a simple mock for testing guards
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<FounderController>(FounderController);
    service = module.get(FounderService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Authentication Endpoints', () => {
    it('should call founderService.signup with the correct DTO', async () => {
      const dto: CreateFounderDto = { name: 'Test', email: 'test@test.com', password: 'pass', phone: '123' };
      service.signup.mockResolvedValue('founder-data');

      const result = await controller.signup(dto);
      
      expect(service.signup).toHaveBeenCalledWith(dto);
      expect(result).toBe('founder-data');
    });

    it('should call founderService.login with the correct DTO', async () => {
      const loginDto: LoginDto = { email: 'test@test.com', password: 'pass' };
      service.login.mockResolvedValue('auth-token');

      const result = await controller.login(loginDto);
      
      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toBe('auth-token');
    });
  });

  describe('Social Authentication Endpoints', () => {
    it('should call founderService.socialLogin for google', async () => {
      service.socialLogin.mockResolvedValue('social-token');
      await controller.googleLogin();
      expect(service.socialLogin).toHaveBeenCalledWith('google');
    });

    it('should call founderService.socialLogin for apple', async () => {
      await controller.appleLogin();
      expect(service.socialLogin).toHaveBeenCalledWith('apple');
    });

    it('should call founderService.socialSignup for facebook', async () => {
      service.socialSignup.mockResolvedValue('social-signup-data');
      await controller.facebookSignup();
      expect(service.socialSignup).toHaveBeenCalledWith('facebook');
    });
  });

  describe('Protected Profile Endpoints', () => {
    const mockRequest = { user: { userId: '123' } };

    it('should be protected by JwtAuthGuard', () => {
        // Use Reflect.getMetadata to check for the guard
        const guards = Reflect.getMetadata('__guards__', controller.getProfile);
        expect(guards[0].name).toBe(JwtAuthGuard.name);
    });

    it('should call founderService.getUserProfile with req.user.userId', async () => {
      service.getUserProfile.mockResolvedValue({ id: '123', name: 'Test' });

      const result = await controller.getProfile(mockRequest);
      
      expect(service.getUserProfile).toHaveBeenCalledWith('123');
      expect(result).toEqual({ id: '123', name: 'Test' });
    });

    it('should call founderService.updateProfile with userId and DTO', async () => {
      const updateDto: UpdateFounderDto = { name: 'New Name' };
      service.updateProfile.mockResolvedValue({ id: '123', name: 'New Name' });

      const result = await controller.updateProfile(mockRequest, updateDto);
      
      expect(service.updateProfile).toHaveBeenCalledWith('123', updateDto);
      expect(result).toEqual({ id: '123', name: 'New Name' });
    });
  });
});