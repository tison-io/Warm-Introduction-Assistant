import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Reminder } from '../schemas/reminder.schema';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(@InjectModel(Reminder.name) private reminderModel: Model<Reminder>) {}

  async findAllByUser(founderId: string) {
    const now = new Date();
    return this.reminderModel
      .find({ founderId, date: { $lte: now }, status: 'sent' })
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
    // Create notification record
    this.logger.log(`Processing reminder for intro ${reminder.introId}`);
    
    // Update reminder status
    await this.reminderModel.findByIdAndUpdate(reminder._id, {
      status: 'sent'
    });
  }

  async createReminder(ownerId: string, introId: string, date: Date) {
    const reminder = new this.reminderModel({
      founderId: ownerId,
      introId,
      date,
      status: 'queued'
    });
    return reminder.save();
  }
}