import { Test, TestingModule } from '@nestjs/testing';
import { TransformService } from './transform.service';
import { getModelToken } from '@nestjs/mongoose';
import { IntroQueue } from './entities/intro-queue.schema';
import { ReminderService } from '../scheduler/reminder.service';
import { Types } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Mock Mongoose Document
class MockIntroQueueDocument {
  _id = new Types.ObjectId();
  startupId: Types.ObjectId;
  startupName: string;
  investorId: Types.ObjectId;
  investorName: string;
  founderId: Types.ObjectId;
  preferredIntroFormat: string;
  introPreferencesText?: string;
  generatedIntro: string;
  status: 'queued' | 'sent' | 'completed' = 'queued';
  reminderSent: boolean = false;
  followUpCount: number = 0;
  followUpDueDate?: Date;
  sentDate?: Date;

  constructor(data: Partial<MockIntroQueueDocument>) {
    Object.assign(this, data);
  }

  save = jest.fn().mockResolvedValue(this);
}

describe('TransformService', () => {
  let service: TransformService;
  let introQueueModel: any;
  let reminderService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransformService,
        {
          provide: getModelToken(IntroQueue.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: ReminderService,
          useValue: {
            createReminder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransformService>(TransformService);
    introQueueModel = module.get(getModelToken(IntroQueue.name));
    reminderService = module.get(ReminderService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('transformIntro', () => {
    it('should throw BadRequestException if blurb is missing', async () => {
      await expect(service.transformIntro({ blurb: '', investor_preference: 'pref' } as any))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if investor_preference is missing', async () => {
      await expect(service.transformIntro({ blurb: 'blurb', investor_preference: '' } as any))
        .rejects.toThrow(BadRequestException);
    });

    it('should return transformed intro response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('Transformed intro text'),
      } as any);

      const dto = { blurb: 'Hello', investor_preference: 'pref' };
      const result = await service.transformIntro(dto as any);

      expect(result.transformed_intro).toBe('Transformed intro text');
      expect(result.success).toBe(true);
    });
  });

  describe('getIntrosByFounder', () => {
    it('should return intros for a founder', async () => {
      const founderId = new Types.ObjectId().toHexString();
      const mockIntro = new MockIntroQueueDocument({ founderId: new Types.ObjectId(founderId) });

      introQueueModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockIntro]),
        }),
      });

      const result = await service.getIntrosByFounder(founderId);
      expect(result).toEqual([mockIntro]);
    });
  });

  describe('queueIntro', () => {
    it('should create a queued intro', async () => {
      const founderId = new Types.ObjectId().toHexString();
      const startupId = new Types.ObjectId().toHexString();
      const investorId = new Types.ObjectId().toHexString();

      const mockIntro = new MockIntroQueueDocument({
        founderId: new Types.ObjectId(founderId),
        startupId: new Types.ObjectId(startupId),
        investorId: new Types.ObjectId(investorId),
        startupName: 'Startup',
        investorName: 'Investor',
        preferredIntroFormat: 'email',
        generatedIntro: 'Generated',
      });

      introQueueModel.create.mockResolvedValue(mockIntro);

      const result = await service.queueIntro({
        founderId,
        startupId,
        startupName: 'Startup',
        investorId,
        investorName: 'Investor',
        preferredIntroFormat: 'email',
        generatedIntro: 'Generated',
      });

      expect(introQueueModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockIntro);
    });

    it('should throw BadRequestException if followUpDueDate is provided', async () => {
      await expect(service.queueIntro({
        founderId: new Types.ObjectId().toHexString(),
        startupId: new Types.ObjectId().toHexString(),
        startupName: 'Startup',
        investorId: new Types.ObjectId().toHexString(),
        investorName: 'Investor',
        preferredIntroFormat: 'email',
        generatedIntro: 'Generated',
        followUpDueDate: new Date(),
      })).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateIntroStatus', () => {
    it('should throw NotFoundException if intro not found', async () => {
      introQueueModel.findById.mockResolvedValue(null);
      await expect(service.updateIntroStatus(new Types.ObjectId().toHexString(), 'sent', new Date()))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if followUpDueDate rules are violated', async () => {
      const intro = new MockIntroQueueDocument({});
      introQueueModel.findById.mockResolvedValue(intro);

      await expect(service.updateIntroStatus(new Types.ObjectId().toHexString(), 'sent'))
        .rejects.toThrow(BadRequestException);

      await expect(service.updateIntroStatus(new Types.ObjectId().toHexString(), 'queued', new Date()))
        .rejects.toThrow(BadRequestException);
    });

    it('should update intro status to sent and call reminderService', async () => {
      const founderId = new Types.ObjectId();
      const intro = new MockIntroQueueDocument({
        founderId,
        status: 'queued',
      });
      introQueueModel.findById.mockResolvedValue(intro);

      const followUpDate = new Date();
      reminderService.createReminder.mockResolvedValue({ success: true });

      const result = await service.updateIntroStatus(intro._id.toHexString(), 'sent', followUpDate);

      expect(result.status).toBe('sent');
      expect(result.sentDate).toBeInstanceOf(Date);
      expect(result.followUpDueDate).toBe(followUpDate);
      expect(reminderService.createReminder).toHaveBeenCalledWith(
        founderId.toHexString(),
        intro._id.toHexString(),
        followUpDate
      );
    });

    it('should update intro status to completed', async () => {
      const intro = new MockIntroQueueDocument({ status: 'sent' });
      introQueueModel.findById.mockResolvedValue(intro);

      const result = await service.updateIntroStatus(intro._id.toHexString(), 'completed');
      expect(result.status).toBe('completed');
      expect(result.followUpDueDate).toBeNull();
    });
  });
});
