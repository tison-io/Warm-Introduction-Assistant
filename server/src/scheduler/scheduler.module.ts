import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReminderService } from './reminder.service';
import { Reminder, ReminderSchema } from '../schemas/reminder.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Reminder.name, schema: ReminderSchema }])],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class SchedulerModule {}