import { Test, TestingModule } from '@nestjs/testing';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AccessGuard } from '../guards/access.guard';

describe('ReminderController', () => {
  let controller: ReminderController;
  let service: ReminderService;

  const mockReminderService = {
    findAllByUser: jest.fn(),
    markReminderAndIntroCompleted: jest.fn(),
    deleteReminder: jest.fn(),
  };

  const mockGuard = { canActivate: jest.fn(() => true) };

  const mockRequest = {
    user: { userId: 'user_123' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderController],
      providers: [
        {
          provide: ReminderService,
          useValue: mockReminderService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(AccessGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<ReminderController>(ReminderController);
    service = module.get<ReminderService>(ReminderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllReminders', () => {
    it('should call findAllByUser with userId and workspaceId', async () => {
      const workspaceId = 'work_999';
      mockReminderService.findAllByUser.mockResolvedValue([]);

      await controller.getAllReminders(mockRequest, workspaceId);

      expect(service.findAllByUser).toHaveBeenCalledWith('user_123', workspaceId);
    });
  });

  describe('markAsDone', () => {
    it('should call markReminderAndIntroCompleted', async () => {
      const reminderId = 'rem_1';
      mockReminderService.markReminderAndIntroCompleted.mockResolvedValue({ success: true });

      const result = await controller.markAsDone(reminderId, mockRequest);

      expect(service.markReminderAndIntroCompleted).toHaveBeenCalledWith(reminderId, 'user_123');
      expect(result).toEqual({ success: true });
    });
  });

  describe('deleteReminder', () => {
    it('should call deleteReminder service method', async () => {
      const reminderId = 'rem_2';
      mockReminderService.deleteReminder.mockResolvedValue({ success: true });

      const result = await controller.deleteReminder(reminderId, mockRequest);

      expect(service.deleteReminder).toHaveBeenCalledWith(reminderId, 'user_123');
      expect(result).toEqual({ success: true });
    });
  });
});