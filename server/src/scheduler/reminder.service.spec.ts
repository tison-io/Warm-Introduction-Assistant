import { Test, TestingModule } from '@nestjs/testing';
import { ReminderService } from './reminder.service';
import { getModelToken } from '@nestjs/mongoose';
import { Reminder } from '../schemas/reminder.schema';
import { IntroQueue } from '../transform/entities/intro-queue.schema';
import { WorkspacesService } from '../workspace/workspace.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('ReminderService', () => {
  let service: ReminderService;
  let reminderModel: any;
  let introQueueModel: any;
  let workspaceService: WorkspacesService;

  const mockUserId = new Types.ObjectId().toString();
  const mockIntroId = new Types.ObjectId().toString();
  const mockReminderId = new Types.ObjectId().toString();

  beforeEach(async () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    const mockReminderModel = {
      find: jest.fn().mockReturnValue(mockQuery),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      save: jest.fn(),
    };

    const mockReminderConstructor = jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue(dto),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReminderService,
        {
          provide: getModelToken(Reminder.name),
          useValue: Object.assign(mockReminderConstructor, mockReminderModel),
        },
        {
          provide: getModelToken(IntroQueue.name),
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: WorkspacesService,
          useValue: {
            getMembers: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReminderService>(ReminderService);
    reminderModel = module.get(getModelToken(Reminder.name));
    introQueueModel = module.get(getModelToken(IntroQueue.name));
    workspaceService = module.get<WorkspacesService>(WorkspacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByUser', () => {
    it('should query by workspaceId if provided', async () => {
      const workspaceId = new Types.ObjectId().toString();
      await service.findAllByUser(mockUserId, workspaceId);

      expect(workspaceService.getMembers).toHaveBeenCalledWith(workspaceId, mockUserId);
      expect(reminderModel.find).toHaveBeenCalledWith(expect.objectContaining({
        workspaceId: new Types.ObjectId(workspaceId),
        status: 'sent'
      }));
    });

    it('should query by founderId if workspaceId is null', async () => {
      await service.findAllByUser(mockUserId);

      expect(reminderModel.find).toHaveBeenCalledWith(expect.objectContaining({
        founderId: new Types.ObjectId(mockUserId),
        workspaceId: null
      }));
    });
  });

  describe('checkReminders (Cron)', () => {
    it('should process all queued reminders', async () => {
      const mockReminders = [
        { _id: '1', introId: 'intro1' },
        { _id: '2', introId: 'intro2' },
      ];
      
      reminderModel.find().exec.mockResolvedValue(mockReminders);

      await service.checkReminders();

      expect(reminderModel.findByIdAndUpdate).toHaveBeenCalledTimes(2);
      expect(reminderModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { status: 'sent' });
    });
  });

  describe('deleteReminder', () => {
    it('should throw NotFound if reminder missing', async () => {
      reminderModel.findById.mockResolvedValue(null);
      await expect(service.deleteReminder('id', 'user')).rejects.toThrow(NotFoundException);
    });

    it('should throw Forbidden if user is not the founder', async () => {
      const reminder = { founderId: new Types.ObjectId(), workspaceId: null };
      reminderModel.findById.mockResolvedValue(reminder);

      await expect(service.deleteReminder(mockReminderId, 'wrong-user'))
        .rejects.toThrow(ForbiddenException);
    });

    it('should delete if user is the founder', async () => {
      const reminder = { founderId: mockUserId, workspaceId: null };
      reminderModel.findById.mockResolvedValue(reminder);

      const result = await service.deleteReminder(mockReminderId, mockUserId.toString());
      
      expect(reminderModel.findByIdAndDelete).toHaveBeenCalledWith(mockReminderId);
      expect(result.success).toBe(true);
    });
  });

  describe('markReminderAndIntroCompleted', () => {
    it('should update both intro and reminder status', async () => {
      const mockReminder = { 
        introId: mockIntroId, 
        founderId: mockUserId,
        status: 'sent',
        save: jest.fn().mockResolvedValue(true)
      };
      const mockIntro = { 
        status: 'queued', 
        save: jest.fn().mockResolvedValue(true) 
      };

      reminderModel.findById.mockResolvedValue(mockReminder);
      introQueueModel.findById.mockResolvedValue(mockIntro);

      await service.markReminderAndIntroCompleted(mockReminderId, mockUserId.toString());

      expect(mockIntro.status).toBe('completed');
      expect(mockReminder.status).toBe('completed');
      expect(mockIntro.save).toHaveBeenCalled();
      expect(mockReminder.save).toHaveBeenCalled();
    });
  });
});