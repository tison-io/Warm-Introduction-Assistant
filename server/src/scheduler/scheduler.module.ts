import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReminderService } from './reminder.service';
import { Reminder, ReminderSchema } from '../schemas/reminder.schema';
import { ReminderController } from './reminder.controller';
import { IntroQueue, IntroQueueSchema } from 'src/transform/entities/intro-queue.schema';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { Workspace, WorkspaceSchema } from 'src/workspace/entities/workspace.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reminder.name, schema: ReminderSchema },
      { name: IntroQueue.name, schema: IntroQueueSchema },
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
    WorkspaceModule,
  ],
  controllers: [ReminderController],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class SchedulerModule {}