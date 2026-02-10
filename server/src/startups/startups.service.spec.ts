import { Test, TestingModule } from '@nestjs/testing';
import { StartupsService } from './startups.service';
import { getModelToken } from '@nestjs/mongoose';
import { Startup } from './entities/startup.entity';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('StartupsService', () => {
  let service: StartupsService;
  let model: any;

  const mockFounderId = new Types.ObjectId().toString();
  const mockStartupId = new Types.ObjectId().toString();

  const mockStartup = {
    _id: mockStartupId,
    name: 'Tech Innovators',
    founderId: mockFounderId,
    save: jest.fn(),
  };

  beforeEach(async () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    const mockModel = {
      find: jest.fn().mockReturnValue(mockQuery),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
      countDocuments: jest.fn(),
      new: jest.fn().mockImplementation((dto) => ({
        ...dto,
        save: jest.fn().mockResolvedValue({ ...dto, _id: mockStartupId }),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StartupsService,
        {
          provide: getModelToken(Startup.name),
          useValue: Object.assign(mockModel.new, mockModel),
        },
      ],
    }).compile();

    service = module.get<StartupsService>(StartupsService);
    model = module.get(getModelToken(Startup.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a startup', async () => {
      const dto = { name: 'New Startup', founderName: 'John Doe' };
      const result = await service.create(dto as any);

      expect(result.name).toEqual(dto.name);
      expect(model).toHaveBeenCalled();
    });
  });

  describe('findMyRequests', () => {
    it('should return paginated results with metadata', async () => {
      const mockList = [mockStartup];
      model.find().sort().skip().limit().exec.mockResolvedValue(mockList);
      model.countDocuments.mockResolvedValue(1);

      const result = await service.findMyRequests(mockFounderId, 1, 5, 'test');

      expect(model.find).toHaveBeenCalledWith(expect.objectContaining({
        founderId: mockFounderId,
        $or: expect.any(Array),
      }));
      expect(result.meta.total).toBe(1);
      expect(result.startups).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return a startup if found and owned by user', async () => {
      model.findOne.mockResolvedValue(mockStartup);
      const result = await service.findOne(mockStartupId, mockFounderId);
      expect(result).toEqual(mockStartup);
    });

    it('should throw NotFoundException if startup missing or not owned', async () => {
      model.findOne.mockResolvedValue(null);
      await expect(service.findOne('any', 'any')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the new document', async () => {
      const updateDto = { name: 'Updated Name' };
      model.findOneAndUpdate.mockResolvedValue({ ...mockStartup, ...updateDto });

      const result = await service.update(mockStartupId, updateDto, mockFounderId);
      expect(result.name).toBe('Updated Name');
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockStartupId, founderId: mockFounderId },
        updateDto,
        { new: true }
      );
    });
  });

  describe('remove', () => {
    it('should delete and return success message', async () => {
      model.findOneAndDelete.mockResolvedValue(mockStartup);
      const result = await service.remove(mockStartupId, mockFounderId);
      expect(result.message).toContain('successfully');
    });

    it('should throw NotFoundException if delete fails', async () => {
      model.findOneAndDelete.mockResolvedValue(null);
      await expect(service.remove('any', 'any')).rejects.toThrow(NotFoundException);
    });
  });
});