import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntroQueue, IntroQueueSchema } from './entities/intro-queue.schema';
import { TransformService } from './transform.service';
import { TransformController } from './transform.controller';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { MailModule } from 'src/mail/mail.module';
import { InvestorsModule } from 'src/investors/investors.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { Investor, InvestorSchema } from 'src/schemas/investor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IntroQueue.name, schema: IntroQueueSchema },
      { name: Investor.name, schema: InvestorSchema }
    ]),
    SchedulerModule,
    MailModule,
    InvestorsModule,
    WorkspaceModule,
  ],
  controllers: [TransformController],
  providers: [TransformService],
})
export class TransformModule {}
