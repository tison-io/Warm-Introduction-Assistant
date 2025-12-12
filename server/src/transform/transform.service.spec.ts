import { Test, TestingModule } from '@nestjs/testing';
import { TransformService } from './transform.service';
import { getModelToken } from '@nestjs/mongoose';
import { IntroQueue } from './entities/intro-queue.schema';
import { ReminderService } from '../scheduler/reminder.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransformIntroDto } from './dto/transform-intro.dto';

// Mock fetch globally
global.fetch = jest.fn();

describe('TransformService', () => {
  let service: TransformService;
  let model: any;
  let reminderService: ReminderService;

  const mockIntroQueueModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    findById: jest.fn(),
  };

  const mockReminderService = {
    createReminder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransformService,
        {
          provide: getModelToken(IntroQueue.name),
          useValue: mockIntroQueueModel,
        },
        {
          provide: ReminderService,
          useValue: mockReminderService,
        },
      ],
    }).compile();

    service = module.get<TransformService>(TransformService);
    model = module.get(getModelToken(IntroQueue.name));
    reminderService = module.get(ReminderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------------
  // transformIntro
  // -----------------------------
  describe('transformIntro', () => {
    it('should throw BadRequestException if blurb is missing', async () => {
      await expect(service.transformIntro({ blurb: '', investor_preference: 'email' }))
        .rejects.toThrow(BadRequestException);
    });

    it('should call fetch and return transformed intro', async () => {
      const dto: TransformIntroDto = { blurb: 'Hello', investor_preference: 'email' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: jest.fn().mockResolvedValue('Transformed Intro'),
      });

      const result = await service.transformIntro(dto);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://warm-introduction-assistant.onrender.com/transform',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ blurb: 'Hello', investor_preference: 'email' }),
        })
      );

      expect(result).toEqual({
        success: true,
        message: 'Intro transformed successfully.',
        original: dto,
        transformed_intro: 'Transformed Intro',
      });
    });

    it('should throw BadRequestException if fetch fails', async () => {
      const dto: TransformIntroDto = { blurb: 'Hello', investor_preference: 'email' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(service.transformIntro(dto)).rejects.toThrow(BadRequestException);
    });
  });

  // -----------------------------
  // getIntrosByFounder
  // -----------------------------
  describe('getIntrosByFounder', () => {
    it('should return intros sorted by createdAt', async () => {
      const mockIntros = [{ _id: '1' }, { _id: '2' }];
      model.exec.mockResolvedValue(mockIntros);

      const result = await service.getIntrosByFounder('founder123');
      expect(model.find).toHaveBeenCalledWith({ founderId: 'founder123' });
      expect(model.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toBe(mockIntros);
    });
  });

  // -----------------------------
  // queueIntro
  // -----------------------------
  describe('queueIntro', () => {
    it('should throw if followUpDueDate is provided', async () => {
      await expect(service.queueIntro({
        startupId: '1',
        startupName: 'S',
        investorId: '2',
        investorName: 'I',
        founderId: 'F',
        preferredIntroFormat: 'email',
        generatedIntro: 'intro',
        followUpDueDate: new Date(),
      })).rejects.toThrow('Cannot set follow-up date');
    });

    it('should call create on the model', async () => {
      const data = {
        startupId: '1',
        startupName: 'S',
        investorId: '2',
        investorName: 'I',
        founderId: 'F',
        preferredIntroFormat: 'email',
        generatedIntro: 'intro',
      };

      const created = { _id: 'abc', ...data, status: 'queued', reminderSent: false, followUpCount: 0 };
      model.create.mockResolvedValue(created);

      const result = await service.queueIntro(data);

      expect(model.create).toHaveBeenCalledWith(expect.objectContaining({
        ...data,
        status: 'queued',
        reminderSent: false,
        followUpCount: 0,
      }));
      expect(result).toBe(created);
    });
  });

  // -----------------------------
  // updateIntroStatus
  // -----------------------------
  describe('updateIntroStatus', () => {
    it('should throw NotFoundException if intro not found', async () => {
      model.findById.mockResolvedValue(null);
      await expect(service.updateIntroStatus('id', 'queued')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if followUpDueDate set and status != sent', async () => {
      const intro = { save: jest.fn() };
      model.findById.mockResolvedValue(intro);
      await expect(service.updateIntroStatus('id', 'queued', new Date()))
        .rejects.toThrow(BadRequestException);
    });

    it('should update intro status to sent and call reminderService', async () => {
      const intro: any = { save: jest.fn(), status: 'queued', founderId: 'F', _id: 'abc' };
      model.findById.mockResolvedValue(intro);
      const dueDate = new Date();

      await service.updateIntroStatus('id', 'sent', dueDate);

      expect(intro.status).toBe('sent');
      expect(intro.sentDate).toBeInstanceOf(Date);
      expect(intro.followUpDueDate).toBe(dueDate);
      expect(reminderService.createReminder).toHaveBeenCalledWith('F', 'abc', dueDate);
      expect(intro.save).toHaveBeenCalled();
    });

    it('should update intro status to completed', async () => {
      const intro: any = { save: jest.fn(), status: 'sent', founderId: 'F', _id: 'abc' };
      model.findById.mockResolvedValue(intro);

      await service.updateIntroStatus('id', 'completed');

      expect(intro.status).toBe('completed');
      expect(intro.save).toHaveBeenCalled();
    });
  });
});
