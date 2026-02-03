import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { InvestorsService } from './investors.service';
import { Investor } from '../schemas/investor.schema';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { Types } from 'mongoose';

// Mock Mongoose Document
class MockInvestorDocument {
  _id = new Types.ObjectId();
  __v = 0;
  name: string;
  tags: string[];
  preferred_intro_format: string;
  intro_preferences_text: string;
  notes?: string;
  userId: string;

  constructor(data: Partial<MockInvestorDocument>) {
    Object.assign(this, data);
  }

  save = jest.fn().mockResolvedValue(this);
}

describe('InvestorsService', () => {
  let service: InvestorsService;
  let model: any;

  const mockInvestorData = {
    name: 'Test Investor',
    tags: ['tech', 'finance'],
    preferred_intro_format: 'email',
    intro_preferences_text: 'Looking for tech startups',
    notes: 'Optional note',
    userId: 'userId123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestorsService,
        {
          provide: getModelToken(Investor.name),
          useValue: MockInvestorDocument,
        },
      ],
    }).compile();

    service = module.get<InvestorsService>(InvestorsService);
    model = module.get(getModelToken(Investor.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return an investor', async () => {
      const dto: CreateInvestorDto = { ...mockInvestorData };
      const result = await service.create(dto, mockInvestorData.userId);

      expect(result).toBeInstanceOf(MockInvestorDocument);
      expect(result.name).toEqual(dto.name);
      expect(result.save).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all investors for a user', async () => {
      model.find = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockInvestorData]) });

      const result = await service.findAll(mockInvestorData.userId);

      expect(model.find).toHaveBeenCalledWith({ userId: mockInvestorData.userId });
      expect(result).toEqual([mockInvestorData]);
    });

    it('should apply search filter', async () => {
      model.find = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockInvestorData]) });

      await service.findAll(mockInvestorData.userId, 'tech');

      expect(model.find).toHaveBeenCalledWith({
        userId: mockInvestorData.userId,
        name: { $regex: 'tech', $options: 'i' },
      });
    });
  });

  describe('findOne', () => {
    it('should return investor if found', async () => {
      model.findOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockInvestorData) });

      const result = await service.findOne('id123', mockInvestorData.userId);

      expect(result).toEqual(mockInvestorData);
    });

    it('should throw NotFoundException if not found', async () => {
      model.findOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.findOne('id123', mockInvestorData.userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return investor', async () => {
      const dto: UpdateInvestorDto = { name: 'Updated' };
      model.findOneAndUpdate = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockInvestorData) });

      const result = await service.update('id123', dto, mockInvestorData.userId);

      expect(result).toEqual(mockInvestorData);
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'id123', userId: mockInvestorData.userId },
        dto,
        { new: true },
      );
    });

    it('should throw NotFoundException if not found', async () => {
      model.findOneAndUpdate = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.update('id123', {}, mockInvestorData.userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove and return investor', async () => {
      model.findOneAndDelete = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockInvestorData) });

      const result = await service.remove('id123', mockInvestorData.userId);

      expect(result).toEqual(mockInvestorData);
      expect(model.findOneAndDelete).toHaveBeenCalledWith({ _id: 'id123', userId: mockInvestorData.userId });
    });

    it('should throw NotFoundException if not found', async () => {
      model.findOneAndDelete = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.remove('id123', mockInvestorData.userId)).rejects.toThrow(NotFoundException);
    });
  });
});
