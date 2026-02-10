import { Test, TestingModule } from '@nestjs/testing';
import { StartupsController } from './startups.controller';
import { StartupsService } from './startups.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AccessGuard } from '../guards/access.guard';

describe('StartupsController', () => {
  let controller: StartupsController;
  let service: StartupsService;

  const mockStartupsService = {
    create: jest.fn(),
    findMyRequests: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockGuard = { canActivate: jest.fn(() => true) };
  const mockUserRequest = { user: { userId: 'founder_123' } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StartupsController],
      providers: [
        {
          provide: StartupsService,
          useValue: mockStartupsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(AccessGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<StartupsController>(StartupsController);
    service = module.get<StartupsService>(StartupsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = { name: 'New Startup' };
      await controller.create(dto as any, mockUserRequest);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findMyStartups', () => {
    it('should convert query strings to numbers and call service', async () => {
      await controller.findMyStartups(mockUserRequest, '2', '10', 'search-term');

      expect(service.findMyRequests).toHaveBeenCalledWith(
        'founder_123',
        2,
        10,
        'search-term'
      );
    });

    it('should use default values if queries are not provided', async () => {
      await controller.findMyStartups(mockUserRequest);

      expect(service.findMyRequests).toHaveBeenCalledWith(
        'founder_123',
        1,
        5,
        undefined
      );
    });
  });

  describe('findOne', () => {
    it('should pass id and userId to service', async () => {
      const id = 'startup_abc';
      await controller.findOne(id, mockUserRequest);
      expect(service.findOne).toHaveBeenCalledWith(id, 'founder_123');
    });
  });

  describe('update', () => {
    it('should pass id, dto, and userId to service', async () => {
      const id = 'startup_abc';
      const dto = { name: 'Updated' };
      await controller.update(id, dto, mockUserRequest);
      expect(service.update).toHaveBeenCalledWith(id, dto, 'founder_123');
    });
  });

  describe('remove', () => {
    it('should call remove with correct parameters', async () => {
      const id = 'startup_abc';
      await controller.remove(id, mockUserRequest);
      expect(service.remove).toHaveBeenCalledWith(id, 'founder_123');
    });
  });
});