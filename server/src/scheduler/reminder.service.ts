import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Reminder } from '../schemas/reminder.schema';
import { IntroQueue } from '../transform/entities/intro-queue.schema';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    @InjectModel(Reminder.name) private reminderModel: Model<Reminder>,
    @InjectModel(IntroQueue.name) private introQueueModel: Model<IntroQueue>,
  ) {}

  async findAllByUser(founderId: string) {
    const now = new Date();
    return this.reminderModel
      .find({ 
        founderId: new Types.ObjectId(founderId), 
        date: { $lte: now }, 
        status: 'sent',
      })
      .sort({ createdAt: 1 })
      .populate({
        path: 'introId', 
        select: 'startupName investorName startupId investorId generatedIntro followUpDueDate',
      })
      .exec();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkReminders() {
    const now = new Date();
    const reminders = await this.reminderModel.find({
      date: { $lte: now },
      status: 'queued'
    }).exec();

    for (const reminder of reminders) {
      await this.processReminder(reminder);
    }

    this.logger.log(`Processed ${reminders.length} reminders`);
  }

  private async processReminder(reminder: Reminder) {
    
    this.logger.log(`Processing reminder for intro ${reminder.introId}`);
    
    await this.reminderModel.findByIdAndUpdate(reminder._id, {
      status: 'sent'
    });
  }

  async createReminder(ownerId: string, introId: string, date: Date) {
    const reminder = new this.reminderModel({
      founderId: new Types.ObjectId(ownerId),
      introId: new Types.ObjectId(introId),
      date,
      status: 'queued'
    });
    return reminder.save();
  }

  async deleteReminder(reminderId: string, founderId: string) {
    const result = await this.reminderModel.findOneAndDelete({
      _id: new Types.ObjectId(reminderId),
      founderId: new Types.ObjectId(founderId),
    }).exec();

  if (!result) {
   throw new NotFoundException('Reminder not found or unauthorized.');
  }

  this.logger.log(`Deleted reminder ${reminderId} for founder ${founderId}`);
    return { success: true };
  }

  async markReminderAndIntroCompleted(reminderId: string, founderId: string) {
    
    const founderObjectId = new Types.ObjectId(founderId);

    const reminder = await this.reminderModel.findOne({
        _id: new Types.ObjectId(reminderId),
        founderId: founderObjectId,
    }).exec();

    if (!reminder) {
        throw new NotFoundException('Reminder not found or unauthorized.');
    }
    
    const intro = await this.introQueueModel.findOne({
        _id: reminder.introId,
        founderId: founderObjectId,
    });
    
    if (!intro) {
        throw new NotFoundException('Linked Intro not found.');
    }
    
    if (intro.status === 'completed' && reminder.status === 'completed') {
      this.logger.warn(`Intro ${intro._id} was already completed.`);
      return { success: true };
    }
    
    if (intro.status !== 'completed') {
        intro.status = 'completed';
        intro.followUpDueDate = null; 
        await intro.save();
    }

    if (reminder.status !== 'completed') {
        reminder.status = 'completed';
        await reminder.save();
    }
    
    this.logger.log(`Completed intro ${intro._id} and reminder ${reminder._id}`);
    return { success: true };
  }
}