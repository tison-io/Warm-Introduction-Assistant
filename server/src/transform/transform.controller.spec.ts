import { Test, TestingModule } from '@nestjs/testing';
import { TransformController } from './transform.controller';
import { TransformService } from './transform.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AccessGuard } from '../guards/access.guard';

describe('TransformController', () => {
  let controller: TransformController;
  let service: TransformService;

  const mockTransformService = {
    transformIntro: jest.fn(),
    getIntros: jest.fn(),
    queueIntro: jest.fn(),
    getOutcomeLogs: jest.fn(),
    getExecutionRate: jest.fn(),
    updateIntro: jest.fn(),
    remove: jest.fn(),
    updateIntroStatus: jest.fn(),
    requestInvestorConsent: jest.fn(),
    processApproval: jest.fn(),
  };

  const mockGuard = { canActivate: jest.fn(() => true) };
  const mockUserRequest = { user: { userId: 'user_999' } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransformController],
      providers: [
        {
          provide: TransformService,
          useValue: mockTransformService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(AccessGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<TransformController>(TransformController);
    service = module.get<TransformService>(TransformService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('transformIntro', () => {
    it('should call service.transformIntro', async () => {
      const dto = { blurb: 'test', investor_preference: 'tech' };
      await controller.transformIntro(dto as any, mockUserRequest);
      expect(service.transformIntro).toHaveBeenCalledWith(dto, 'user_999');
    });
  });

  describe('getMyIntros', () => {
    it('should handle pagination and search queries', async () => {
      await controller.getMyIntros(mockUserRequest, 'work_1', 'search_val', 2);
      expect(service.getIntros).toHaveBeenCalledWith('user_999', 'work_1', 'search_val', 2);
    });

    it('should default page to 1 if invalid number provided', async () => {
      await controller.getMyIntros(mockUserRequest, undefined, undefined, 0);
      expect(service.getIntros).toHaveBeenCalledWith('user_999', undefined, undefined, 1);
    });
  });

  describe('metrics/execution-rate', () => {
    it('should return wrapped execution rate object', async () => {
      mockTransformService.getExecutionRate.mockResolvedValue(85);
      const result = await controller.getRate(mockUserRequest, 'work_1');
      expect(result).toEqual({ executionRate: 85 });
      expect(service.getExecutionRate).toHaveBeenCalledWith('user_999', 'work_1');
    });
  });

  describe('Double Opt-in Flow', () => {
    it('requestConsent should call service with id', async () => {
      await controller.requestConsent('intro_1');
      expect(service.requestInvestorConsent).toHaveBeenCalledWith('intro_1');
    });

    it('approveIntro should call service with id and email', async () => {
      const email = 'test@investor.com';
      await controller.approveIntro('intro_1', email);
      expect(service.processApproval).toHaveBeenCalledWith('intro_1', email);
    });
  });

  describe('updateStatus', () => {
    it('should pass status and followUpDate to service', async () => {
      const body = { status: 'sent' as const, followUpDueDate: new Date() };
      await controller.updateStatus('intro_1', mockUserRequest, body);
      expect(service.updateIntroStatus).toHaveBeenCalledWith(
        'intro_1',
        'user_999',
        body.status,
        body.followUpDueDate
      );
    });
  });
});