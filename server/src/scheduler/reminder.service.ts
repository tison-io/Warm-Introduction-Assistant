import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Reminder } from '../schemas/reminder.schema';
import { IntroQueue } from '../transform/entities/intro-queue.schema';
import { WorkspacesService } from '../workspace/workspace.service';

@Injectable()
export class ReminderService {
      private readonly logger = new Logger(ReminderService.name);

      constructor(
            @InjectModel(Reminder.name) private reminderModel: Model<Reminder>,
            @InjectModel(IntroQueue.name) private introQueueModel: Model<IntroQueue>,
            private readonly workspaceService: WorkspacesService,
      ) {}

      async findAllByUser(userId: string, workspaceId?: string) {
            const now = new Date();
            let query: any;

            if (workspaceId) {
                  await this.workspaceService.getMembers(workspaceId, userId);
                  query = {
                        workspaceId: new Types.ObjectId(workspaceId),
                        date: { $lte: now },
                        status: 'sent',
                  };
            } else {
                  query = {
                  founderId: new Types.ObjectId(userId),
                  workspaceId: null,
                  date: { $lte: now },
                  status: 'sent' 
                  };
            }

            return this.reminderModel
                  .find(query)
                  .sort({ createdAt: -1 })
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

      async createReminder(ownerId: string, introId: string, date: Date,workspaceId?: string) {
            const reminder = new this.reminderModel({
                  founderId: new Types.ObjectId(ownerId),
                  introId: new Types.ObjectId(introId),
                  workspaceId: workspaceId ? new Types.ObjectId(workspaceId) : null,
                  date,
                  status: 'queued'
            });
            return reminder.save();
      }

      async deleteReminder(reminderId: string, userId: string) {
            const reminder = await this.reminderModel.findById(reminderId);
            if (!reminder) {
                  throw new NotFoundException('Reminder not found.');
            }

            if (reminder.workspaceId) {
                  await this.workspaceService.getMembers(reminder.workspaceId.toString(), userId);
            } else if (reminder.founderId.toString() !== userId) {
                  throw new ForbiddenException('You cant delete this reminder.');
            }

            await this.reminderModel.findByIdAndDelete(reminderId);
            return { success: true };
      }

      async markReminderAndIntroCompleted(reminderId: string, userId: string) {
            const reminder = await this.reminderModel.findById(reminderId);
            if (!reminder) {
                  throw new NotFoundException('Reminder not found.');
            }
            if (reminder.workspaceId) {
                  await this.workspaceService.getMembers(reminder.workspaceId.toString(), userId);
            } else if (reminder.founderId.toString() !== userId) {
                  throw new ForbiddenException('Unauthorized action.');
            }

            const intro = await this.introQueueModel.findById(reminder.introId);
            if (!intro) {
                  throw new NotFoundException('Linked intro not found.');
            }

            intro.status = 'completed';
            intro.followUpDueDate = null;
            reminder.status = 'completed';

            await Promise.all([intro.save(), reminder.save()]);
            return { success: true };
      }
}