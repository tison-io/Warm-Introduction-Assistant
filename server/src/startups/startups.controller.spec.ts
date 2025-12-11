import { Test, TestingModule } from '@nestjs/testing';
import { StartupsController } from './startups.controller';
import { StartupsService } from './startups.service';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';

describe('StartupsController', () => {
  let controller: StartupsController;
  let service: StartupsService;

  const mockStartupsService = {
    create: jest.fn(),
    findAllByFounder: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockReq = { user: { userId: 'founder123' } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StartupsController],
      providers: [
        {
          provide: StartupsService,
          useValue: mockStartupsService,
        },
      ],
    }).compile();

    controller = module.get<StartupsController>(StartupsController);
    service = module.get<StartupsService>(StartupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct arguments', async () => {
      const dto: CreateStartupDto = {
        name: 'Test Startup',
        blurb: 'Short description',
        pitchLink: 'https://link.com',
      };
      const result = { _id: '1', ...dto };

      mockStartupsService.create.mockResolvedValue(result);

      const response = await controller.create(dto, mockReq);
      expect(response).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto, 'founder123');
    });
  });

  describe('findMyStartups', () => {
    it('should return startups for the logged-in founder', async () => {
      const startups = [{ _id: '1' }, { _id: '2' }];
      mockStartupsService.findAllByFounder.mockResolvedValue(startups);

      const response = await controller.findMyStartups(mockReq);
      expect(response).toBe(startups);
      expect(service.findAllByFounder).toHaveBeenCalledWith('founder123');
    });
  });

  describe('findOne', () => {
    it('should return a single startup', async () => {
      const startup = { _id: '1', name: 'Test' };
      mockStartupsService.findOne.mockResolvedValue(startup);

      const response = await controller.findOne('1', mockReq);
      expect(response).toBe(startup);
      expect(service.findOne).toHaveBeenCalledWith('1', 'founder123');
    });
  });

  describe('update', () => {
    it('should update a startup', async () => {
      const dto: UpdateStartupDto = { name: 'Updated' };
      const updated = { _id: '1', ...dto };

      mockStartupsService.update.mockResolvedValue(updated);

      const response = await controller.update('1', dto, mockReq);
      expect(response).toBe(updated);
      expect(service.update).toHaveBeenCalledWith('1', dto, 'founder123');
    });
  });

  describe('remove', () => {
    it('should delete a startup', async () => {
      const response = { message: 'Startup deleted successfully' };
      mockStartupsService.remove.mockResolvedValue(response);

      const res = await controller.remove('1', mockReq);
      expect(res).toBe(response);
      expect(service.remove).toHaveBeenCalledWith('1', 'founder123');
    });
  });
});
