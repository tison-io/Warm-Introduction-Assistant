import { Test, TestingModule } from '@nestjs/testing';
import { FounderController } from './founder.controller';
import { FounderService } from './founder.service';
import { CreateFounderDto } from './dto/create-founder.dto';
import { LoginDto } from './dto/login.dto';

describe('FounderController', () => {
  let controller: FounderController;
  let service: FounderService;

  // 1. Create the Mock Service
  const mockFounderService = {
    signup: jest.fn(),
    login: jest.fn(),
    getUserProfile: jest.fn(),
    updateProfile: jest.fn(),
    updatePassword: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    getTrialStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FounderController],
      providers: [
        {
          provide: FounderService,
          useValue: mockFounderService,
        },
      ],
    }).compile();

    controller = module.get<FounderController>(FounderController);
    service = module.get<FounderService>(FounderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call service.signup with DTO', async () => {
      const dto: CreateFounderDto = { 
        name: 'John', email: 'j@j.com', password: '123', phone: '123' 
      };
      mockFounderService.signup.mockResolvedValue({ id: '1', ...dto });

      const result = await controller.signup(dto);

      expect(service.signup).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id', '1');
    });
  });

  describe('getProfile', () => {
    it('should extract userId from req and call service', async () => {
      const mockReq = { user: { userId: 'user_123' } };
      mockFounderService.getUserProfile.mockResolvedValue({ name: 'John' });

      await controller.getProfile(mockReq);

      expect(service.getUserProfile).toHaveBeenCalledWith('user_123');
    });
  });

  describe('updateProfile', () => {
    it('should call updateProfile with userId and updateDto', async () => {
      const mockReq = { user: { userId: 'user_123' } };
      const updateDto = { name: 'New Name' };
      
      await controller.updateProfile(mockReq, updateDto);

      expect(service.updateProfile).toHaveBeenCalledWith('user_123', updateDto);
    });
  });

  describe('getTrialStatus', () => {
    it('should return trial data from service', async () => {
      const mockReq = { user: { userId: 'user_123' } };
      const trialData = { tier: 'trial', expired: false, daysRemaining: 5 };
      mockFounderService.getTrialStatus.mockResolvedValue(trialData);

      const result = await controller.getTrialStatus(mockReq);

      expect(service.getTrialStatus).toHaveBeenCalledWith('user_123');
      expect(result.daysRemaining).toBe(5);
    });
  });
});