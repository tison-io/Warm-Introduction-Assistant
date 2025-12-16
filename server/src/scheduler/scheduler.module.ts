import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReminderService } from './reminder.service';
import { Reminder, ReminderSchema } from '../schemas/reminder.schema';
import { ReminderController } from './reminder.controller';
import { IntroQueue, IntroQueueSchema } from 'src/transform/entities/intro-queue.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reminder.name, schema: ReminderSchema },
      { name: IntroQueue.name, schema: IntroQueueSchema },
    ])],
  controllers: [ReminderController],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class SchedulerModule {}