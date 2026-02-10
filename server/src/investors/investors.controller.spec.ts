import { Test, TestingModule } from '@nestjs/testing';
import { InvestorsController } from './investors.controller';
import { InvestorsService } from './investors.service';
import { getModelToken } from '@nestjs/mongoose';
import { Founder } from '../founder/entities/founder.entity';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';

describe('InvestorsController', () => {
  let controller: InvestorsController;
  let service: InvestorsService;

  const mockUserId = 'user-123';
  const mockReq = { user: { userId: mockUserId, email: 'test@test.com' } };

  const mockInvestorsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getFundraisingVelocity: jest.fn(),
    getRecommendations: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestorsController],
      providers: [
        {
          provide: InvestorsService,
          useValue: mockInvestorsService,
        },
        {
          provide: getModelToken(Founder.name),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InvestorsController>(InvestorsController);
    service = module.get<InvestorsService>(InvestorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with DTO and userId', async () => {
      const dto: CreateInvestorDto = { name: 'Sequoia', email: 'v@sequoia.com' } as any;
      await controller.create(dto, mockReq as any);
      expect(service.create).toHaveBeenCalledWith(dto, mockUserId);
    });
  });

  describe('getInvestors', () => {
    it('should parse pagination strings and call service.findAll', async () => {
      await controller.getInvestors('search-term', 'ws-1', '2', '10', mockReq as any);

      expect(service.findAll).toHaveBeenCalledWith(
        mockUserId,
        'ws-1',
        'search-term',
        2,
        10
      );
    });

    it('should use default pagination if strings are missing', async () => {
      await controller.getInvestors(
        undefined as any, 
        undefined as any, 
        undefined as any, 
        undefined as any, 
        mockReq as any
      );
      
      expect(service.findAll).toHaveBeenCalledWith(mockUserId, undefined, undefined, 1, 5);
    });
  });

  describe('getVelocity', () => {
    it('should call getFundraisingVelocity with correct params', async () => {
      await controller.getVelocity('ws-123', mockReq as any);
      expect(service.getFundraisingVelocity).toHaveBeenCalledWith(mockUserId, 'ws-123');
    });
  });

  describe('getRecommendations', () => {
    it('should call getRecommendations with workspaceId and startupId', async () => {
      await controller.getRecommendations('ws-1', 'startup-1', mockReq as any);
      expect(service.getRecommendations).toHaveBeenCalledWith(mockUserId, 'ws-1', 'startup-1');
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id and userId', async () => {
      const id = 'investor-999';
      await controller.findOne(id, mockReq as any);
      expect(service.findOne).toHaveBeenCalledWith(id, mockUserId);
    });
  });

  describe('update', () => {
    it('should call service.update with id, dto, and userId', async () => {
      const id = 'investor-999';
      const dto: UpdateInvestorDto = { name: 'Updated Name' };
      await controller.update(id, dto, mockReq as any);
      expect(service.update).toHaveBeenCalledWith(id, dto, mockUserId);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id and userId', async () => {
      const id = 'investor-delete';
      await controller.remove(id, mockReq as any);
      expect(service.remove).toHaveBeenCalledWith(id, mockUserId);
    });
  });
});