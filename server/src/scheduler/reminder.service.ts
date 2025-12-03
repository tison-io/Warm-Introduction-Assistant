import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Reminder, ReminderDocument } from '../schemas/reminder.schema';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(@InjectModel(Reminder.name) private reminderModel: Model<ReminderDocument>) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkReminders() {
    const now = new Date();
    const reminders = await this.reminderModel.find({
      date: { $lte: now },
      status: 'pending'
    }).exec();

    for (const reminder of reminders) {
      await this.processReminder(reminder);
    }

    this.logger.log(`Processed ${reminders.length} reminders`);
  }

  private async processReminder(reminder: ReminderDocument) {
    // Create notification record
    this.logger.log(`Processing reminder for intro ${reminder.introId}`);
    
    // Update reminder status
    await this.reminderModel.findByIdAndUpdate(reminder._id, {
      status: 'sent'
    });
  }

  async createReminder(ownerId: string, introId: string, date: Date) {
    const reminder = new this.reminderModel({
      ownerId,
      introId,
      date,
      status: 'pending'
    });
    return reminder.save();
  }
}