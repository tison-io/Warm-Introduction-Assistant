import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InvestorsService } from './investors.service';
import { Investor } from '../schemas/investor.schema';
import { Startup } from '../startups/entities/startup.entity';
import { Workspace } from '../workspace/entities/workspace.entity';
import { WorkspacesService } from '../workspace/workspace.service';

describe('InvestorsService', () => {
  let service: InvestorsService;
  let investorModel: any;
  let workspaceService: WorkspacesService;

  const mockUserId = new Types.ObjectId().toString();
  const mockInvestorId = new Types.ObjectId().toString();

  const mockInvestor = {
    _id: mockInvestorId,
    name: 'Sequoia Capital',
    userId: mockUserId,
    workspaceId: null,
    save: jest.fn(),
  };

  // Helper for chaining mocks like .find().sort().skip().limit().exec()
  const mockQuery = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    select: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestorsService,
        {
          provide: getModelToken(Investor.name),
          useValue: {
            new: jest.fn().mockImplementation((dto) => ({ ...dto, save: jest.fn().mockResolvedValue(dto) })),
            constructor: jest.fn().mockImplementation((dto) => ({ ...dto, save: jest.fn().mockResolvedValue(dto) })),
            find: jest.fn().mockReturnValue(mockQuery),
            findOne: jest.fn().mockReturnValue(mockQuery),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            countDocuments: jest.fn().mockReturnValue({ exec: jest.fn() }),
            aggregate: jest.fn(),
            distinct: jest.fn(),
          },
        },
        { provide: getModelToken(Startup.name), useValue: { findOne: jest.fn().mockReturnValue(mockQuery) } },
        { provide: getModelToken(Workspace.name), useValue: { findById: jest.fn().mockReturnValue(mockQuery) } },
        { provide: WorkspacesService, useValue: { getMembers: jest.fn() } },
      ],
    }).compile();

    service = module.get<InvestorsService>(InvestorsService);
    investorModel = module.get(getModelToken(Investor.name));
    workspaceService = module.get<WorkspacesService>(WorkspacesService);
  });

  describe('findAll', () => {
    it('should return paginated investors for personal pipeline', async () => {
      const mockInvestors = [mockInvestor];
      mockQuery.exec.mockResolvedValueOnce(mockInvestors); // For find()
      investorModel.countDocuments().exec.mockResolvedValueOnce(1); // For countDocuments()

      const result = await service.findAll(mockUserId);

      expect(investorModel.find).toHaveBeenCalledWith(expect.objectContaining({
        userId: mockUserId,
        workspaceId: { $in: [null, undefined] }
      }));
      expect(result.investors).toEqual(mockInvestors);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should throw ForbiddenException if user does not own personal investor', async () => {
      const otherUserId = new Types.ObjectId().toString();
      investorModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockInvestor, userId: otherUserId })
      });

      await expect(service.findOne(mockInvestorId, mockUserId))
        .rejects.toThrow(ForbiddenException);
    });

    it('should allow access if investor is in a workspace user belongs to', async () => {
      const workspaceId = new Types.ObjectId().toString();
      investorModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockInvestor, workspaceId })
      });

      await service.findOne(mockInvestorId, mockUserId);

      expect(workspaceService.getMembers).toHaveBeenCalledWith(workspaceId, mockUserId);
    });
  });

  describe('getFundraisingVelocity', () => {
    it('should execute aggregate pipeline with correct match query', async () => {
      const mockAggregationResult = [{ date: '2023-01-01', investorsContacted: 5 }];
      investorModel.aggregate.mockResolvedValue(mockAggregationResult);

      const result = await service.getFundraisingVelocity(mockUserId);

      expect(investorModel.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockAggregationResult);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if investor does not exist', async () => {
      investorModel.findById.mockResolvedValue(null);
      await expect(service.remove('fake-id', mockUserId)).rejects.toThrow(NotFoundException);
    });
  });
});