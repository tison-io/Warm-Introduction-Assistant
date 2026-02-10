import { Test, TestingModule } from '@nestjs/testing';
import { TransformService } from './transform.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { IntroQueue } from './entities/intro-queue.schema';
import { Founder } from '../founder/entities/founder.entity';
import { Investor } from '../schemas/investor.schema';
import { ReminderService } from '../scheduler/reminder.service';
import { WorkspacesService } from '../workspace/workspace.service';
import { MailService } from '../mail/mail.service';

global.fetch = jest.fn();

describe('TransformService', () => {
  let service: TransformService;
  let introQueueModel: any;
  let founderModel: any;
  let mailService: any;

  const mockUserId = new Types.ObjectId().toString();

  beforeEach(async () => {
    const mockQuery = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransformService,
        {
          provide: getModelToken(IntroQueue.name),
          useValue: {
            ...mockQuery,
            countDocuments: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn(),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken('IntroOutcomeLog'),
          useValue: { 
            create: jest.fn(), 
            find: jest.fn().mockReturnValue(mockQuery) 
          },
        },
        {
          provide: getModelToken(Investor.name),
          useValue: { findByIdAndUpdate: jest.fn() },
        },
        {
          provide: getModelToken(Founder.name),
          useValue: { findById: jest.fn() },
        },
        {
          provide: ReminderService,
          useValue: { createReminder: jest.fn() },
        },
        {
          provide: WorkspacesService,
          useValue: { getMembers: jest.fn() },
        },
        {
          provide: MailService,
          useValue: {
            sendConsentEmail: jest.fn(),
            sendGeneratedIntroEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransformService>(TransformService);
    introQueueModel = module.get(getModelToken(IntroQueue.name));
    founderModel = module.get(getModelToken(Founder.name));
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('transformIntro (Tier Limits & GenAI)', () => {
    it('should throw ForbiddenException if free tier user exceeds 5 intros', async () => {
      founderModel.findById.mockResolvedValue({ tier: 'free' });
      introQueueModel.countDocuments.mockResolvedValue(5);

      await expect(
        service.transformIntro({ blurb: 'test', investor_preference: 'email' }, mockUserId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return transformed text on successful API call', async () => {
      founderModel.findById.mockResolvedValue({ tier: 'pro' });
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('Transformed Intro Content'),
      });

      const result = await service.transformIntro(
        { blurb: 'b', investor_preference: 'email' },
        mockUserId,
      );
      expect(result.transformed_intro).toBe('Transformed Intro Content');
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('processApproval (Double Opt-in Logic)', () => {
    const mockIntro = {
      _id: 'intro_123',
      investorEmail: 'investor@test.com',
      founderEmail: 'founder@test.com',
      status: 'approvals_requested',
      investorName: 'Investor Name',
      founderName: 'Founder Name',
      startupName: 'Startup Name',
      generatedIntro: 'Hello...',
      save: jest.fn().mockResolvedValue(true),
    };

    it('should set status to investor_approved when investor approves first', async () => {
      introQueueModel.findById.mockResolvedValue({ ...mockIntro });

      const result = await service.processApproval('intro_123', 'investor@test.com');

      expect(result.intro.status).toBe('investor_approved');
      expect(result.message).toContain('Waiting for the other party');
    });

    it('should finalize and send intro if investor approves after founder already approved', async () => {
      const alreadyApprovedIntro = { 
        ...mockIntro, 
        status: 'founder_approved',
        save: jest.fn().mockResolvedValue(true) 
      };
      introQueueModel.findById.mockResolvedValue(alreadyApprovedIntro);

      await service.processApproval('intro_123', 'investor@test.com');

      expect(alreadyApprovedIntro.status).toBe('sent');
      expect(mailService.sendGeneratedIntroEmail).toHaveBeenCalled();
    });
  });

  describe('getExecutionRate (Aggregation)', () => {
    it('should return calculated rate from aggregation results', async () => {
      introQueueModel.aggregate.mockResolvedValue([{ rate: 75 }]);

      const rate = await service.getExecutionRate(mockUserId);

      expect(rate).toBe(75);
    });

    it('should return 0 if no intros exist', async () => {
      introQueueModel.aggregate.mockResolvedValue([]);
      const rate = await service.getExecutionRate(mockUserId);
      expect(rate).toBe(0);
    });
  });

  describe('remove', () => {
    it('should delete if user is the founder', async () => {
      const mockIntro = { 
        founderId: new Types.ObjectId(mockUserId),
        workspaceId: null 
      };
      introQueueModel.findById.mockResolvedValue(mockIntro);
      introQueueModel.findByIdAndDelete.mockResolvedValue(true);

      await service.remove('intro_id', mockUserId);
      expect(introQueueModel.findByIdAndDelete).toHaveBeenCalledWith('intro_id');
    });
  });
});