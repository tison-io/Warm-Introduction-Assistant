import { Test, TestingModule } from '@nestjs/testing';
import { InvestorsController } from './investors.controller';
import { InvestorsService } from './investors.service';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

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

describe('InvestorsController', () => {
  let controller: InvestorsController;
  let service: any;

  const mockUser = { userId: 'userId123', email: 'test@example.com' };
  const mockInvestor = new MockInvestorDocument({
    name: 'Test Investor',
    tags: ['tech', 'finance'],
    preferred_intro_format: 'email',
    intro_preferences_text: 'Looking for tech startups',
    notes: 'Optional note',
    userId: mockUser.userId,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestorsController],
      providers: [
        {
          provide: InvestorsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockInvestor),
            findAll: jest.fn().mockResolvedValue([mockInvestor]),
            findOne: jest.fn().mockResolvedValue(mockInvestor),
            update: jest.fn().mockResolvedValue(mockInvestor),
            remove: jest.fn().mockResolvedValue(mockInvestor),
          },
        },
      ],
    }).compile();

    controller = module.get<InvestorsController>(InvestorsController);
    service = module.get(InvestorsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create an investor', async () => {
    const dto: CreateInvestorDto = {
      name: 'Test Investor',
      tags: ['tech', 'finance'],
      preferred_intro_format: 'email',
      intro_preferences_text: 'Looking for tech startups',
      notes: 'Optional note',
    };

    const result = await controller.create(dto, { user: mockUser });

    expect(service.create).toHaveBeenCalledWith(dto, mockUser.userId);
    expect(result).toBeInstanceOf(MockInvestorDocument);
  });

  it('should get all investors', async () => {
    const result = await controller.getInvestors('', { user: mockUser });
    expect(service.findAll).toHaveBeenCalledWith(mockUser.userId, '');
    expect(result).toEqual([mockInvestor]);
  });

  it('should get a single investor', async () => {
    const result = await controller.findOne('id123', { user: mockUser });
    expect(service.findOne).toHaveBeenCalledWith('id123', mockUser.userId);
    expect(result).toBe(mockInvestor);
  });

  it('should update an investor', async () => {
    const dto: UpdateInvestorDto = { name: 'Updated' };
    const result = await controller.update('id123', dto, { user: mockUser });
    expect(service.update).toHaveBeenCalledWith('id123', dto, mockUser.userId);
    expect(result).toBe(mockInvestor);
  });

  it('should remove an investor', async () => {
    const result = await controller.remove('id123', { user: mockUser });
    expect(service.remove).toHaveBeenCalledWith('id123', mockUser.userId);
    expect(result).toBe(mockInvestor);
  });

  it('should handle NotFoundException in findOne', async () => {
    service.findOne.mockRejectedValueOnce(new NotFoundException());
    await expect(controller.findOne('invalidId', { user: mockUser })).rejects.toThrow(NotFoundException);
  });
});
