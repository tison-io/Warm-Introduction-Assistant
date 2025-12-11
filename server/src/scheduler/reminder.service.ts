import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Reminder } from '../schemas/reminder.schema';
import { IntroQueue } from 'src/transform/entities/intro-queue.schema';

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

  async deleteReminder(reminderId: string, founderId: string) {
    const result = await this.reminderModel.findOneAndDelete({
      _id: reminderId,
     founderId: founderId,
  }).exec();

  if (!result) {
   throw new NotFoundException('Reminder not found or unauthorized.');
  }

  this.logger.log(`Deleted reminder ${reminderId} for founder ${founderId}`);
    return { success: true };
  }

  async markAsCompleted(introId: string, founderId: string) {
    const intro = await this.introQueueModel.findOne({ _id: introId, founderId });
    if (!intro) throw new NotFoundException('Intro not found');
    intro.status = 'completed';
    await intro.save();
    return { success: true };
  }
}