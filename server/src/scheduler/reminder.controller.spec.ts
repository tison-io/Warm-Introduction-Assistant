import { Test, TestingModule } from '@nestjs/testing';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

// Mock ReminderService
const mockReminderService = {
  findAllByUser: jest.fn(),
  markReminderAndIntroCompleted: jest.fn(),
  deleteReminder: jest.fn(),
};

describe('ReminderController', () => {
  let controller: ReminderController;
  let service: typeof mockReminderService;

  const mockFounderId = new Types.ObjectId().toHexString();
  const mockReminderId = new Types.ObjectId().toHexString();
  const mockReminder = {
    _id: mockReminderId,
    founderId: mockFounderId,
    introId: new Types.ObjectId(),
    status: 'queued',
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
    }).compile();

    controller = module.get<ReminderController>(ReminderController);
    service = module.get(ReminderService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should get all reminders for founder', async () => {
    mockReminderService.findAllByUser.mockResolvedValue([mockReminder]);
    const req = { user: { userId: mockFounderId } };

    const result = await controller.getAllReminders(req);

    expect(service.findAllByUser).toHaveBeenCalledWith(mockFounderId);
    expect(result).toEqual([mockReminder]);
  });

  it('should mark a reminder as done', async () => {
    mockReminderService.markReminderAndIntroCompleted.mockResolvedValue({ success: true });
    const req = { user: { userId: mockFounderId } };

    const result = await controller.markAsDone(mockReminderId, req);

    expect(service.markReminderAndIntroCompleted).toHaveBeenCalledWith(mockReminderId, mockFounderId);
    expect(result).toEqual({ success: true });
  });

  it('should delete a reminder', async () => {
    mockReminderService.deleteReminder.mockResolvedValue({ success: true });
    const req = { user: { userId: mockFounderId } };

    await controller.deleteReminder(mockReminderId, req);

    expect(service.deleteReminder).toHaveBeenCalledWith(mockReminderId, mockFounderId);
  });

  it('should handle NotFoundException when marking as done', async () => {
    mockReminderService.markReminderAndIntroCompleted.mockRejectedValue(new NotFoundException());
    const req = { user: { userId: mockFounderId } };

    await expect(controller.markAsDone(mockReminderId, req)).rejects.toThrow(NotFoundException);
  });

  it('should handle NotFoundException when deleting reminder', async () => {
    mockReminderService.deleteReminder.mockRejectedValue(new NotFoundException());
    const req = { user: { userId: mockFounderId } };

    await expect(controller.deleteReminder(mockReminderId, req)).rejects.toThrow(NotFoundException);
  });
});