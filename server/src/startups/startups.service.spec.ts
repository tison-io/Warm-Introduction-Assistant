import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { StartupsService } from './startups.service';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';

describe('StartupsService', () => {
  let service: StartupsService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StartupsService,

        // IMPORTANT: model is a jest.fn() constructor with mocked methods
        {
          provide: getModelToken('Startup'),
          useFactory: () => {
            const mockConstructor: any = jest.fn(); // <--- key fix

            // instance method
            mockConstructor.prototype.save = jest.fn();

            // static methods
            mockConstructor.find = jest.fn();
            mockConstructor.findOne = jest.fn();
            mockConstructor.findOneAndUpdate = jest.fn();
            mockConstructor.findOneAndDelete = jest.fn();

            return mockConstructor;
          },
        },
      ],
    }).compile();

    service = module.get<StartupsService>(StartupsService);
    model = module.get(getModelToken('Startup'));
  });

  // Helper to produce mock startup document
  const mockStartupDoc = (overrides = {}) => ({
    _id: 'startup123',
    name: 'Test Startup',
    founderId: 'founder123',
    blurb: 'test blurb',
    pitchLink: 'https://example.com',
    save: jest.fn(),
    ...overrides,
  });

  // -----------------------------------------------------
  // CREATE
  // -----------------------------------------------------
  it('should create a startup', async () => {
    const dto: CreateStartupDto = {
      name: 'My Startup',
      blurb: 'Short description here',
      pitchLink: 'https://example.com/pitch',
    };

    const savedDocument = {
      _id: 'startup123',
      ...dto,
      founderId: 'founder123',
    };

    const startupInstance = mockStartupDoc({
      save: jest.fn().mockResolvedValue(savedDocument),
    });

    // Mock the constructor: new model(dto) returns startupInstance
    model.mockImplementation(() => startupInstance);

    const result = await service.create(dto, 'founder123');

    expect(startupInstance.save).toHaveBeenCalled();
    expect(result).toEqual(savedDocument);
  });

  // -----------------------------------------------------
  // FIND ALL BY FOUNDER
  // -----------------------------------------------------
  it('should return all startups by founder', async () => {
    const startups = [{ name: 'S1' }, { name: 'S2' }];

    model.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(startups),
    });

    const result = await service.findAllByFounder('founder123');

    expect(model.find).toHaveBeenCalledWith({ founderId: 'founder123' });
    expect(result).toEqual(startups);
  });

  // -----------------------------------------------------
  // FIND ONE
  // -----------------------------------------------------
  it('should find one startup', async () => {
    const startup = { _id: 'id1', name: 'Test' };

    model.findOne.mockResolvedValue(startup);

    const result = await service.findOne('id1', 'founder123');

    expect(result).toEqual(startup);
    expect(model.findOne).toHaveBeenCalledWith({
      _id: 'id1',
      founderId: 'founder123',
    });
  });

  it('should throw NotFoundException if findOne fails', async () => {
    model.findOne.mockResolvedValue(null);

    await expect(service.findOne('id1', 'founder123')).rejects.toThrow(
      NotFoundException,
    );
  });

  // -----------------------------------------------------
  // UPDATE
  // -----------------------------------------------------
  it('should update a startup', async () => {
    const updated = { _id: 'id1', name: 'Updated' };

    model.findOneAndUpdate.mockResolvedValue(updated);

    const result = await service.update('id1', { name: 'Updated' }, 'founder123');

    expect(result).toEqual(updated);
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'id1', founderId: 'founder123' },
      { name: 'Updated' },
      { new: true },
    );
  });

  it('should throw NotFoundException if update fails', async () => {
    model.findOneAndUpdate.mockResolvedValue(null);

    await expect(
      service.update('id1', { name: 'Updated' }, 'founder123'),
    ).rejects.toThrow(NotFoundException);
  });

  // -----------------------------------------------------
  // DELETE
  // -----------------------------------------------------
  it('should delete a startup', async () => {
    model.findOneAndDelete.mockResolvedValue({ _id: 'id1' });

    const result = await service.remove('id1', 'founder123');

    expect(result).toEqual({ message: 'Startup deleted successfully' });
    expect(model.findOneAndDelete).toHaveBeenCalledWith({
      _id: 'id1',
      founderId: 'founder123',
    });
  });

  it('should throw NotFoundException if delete fails', async () => {
    model.findOneAndDelete.mockResolvedValue(null);

    await expect(service.remove('id1', 'founder123')).rejects.toThrow(
      NotFoundException,
    );
  });
});
