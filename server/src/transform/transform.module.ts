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
import { InvestorsService } from 'src/investors/investors.service';
import { IntroOutcomeLogSchema } from './entities/intro-logs.schema';
import { Founder, FounderSchema } from 'src/founder/entities/founder.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IntroQueue.name, schema: IntroQueueSchema },
      { name: Investor.name, schema: InvestorSchema },
      { name: 'IntroOutcomeLog', schema: IntroOutcomeLogSchema },
      { name: Founder.name, schema: FounderSchema }
    ]),
    SchedulerModule,
    MailModule,
    InvestorsModule,
    WorkspaceModule,
    InvestorsModule,
  ],
  controllers: [TransformController],
  providers: [TransformService, InvestorsService],
})
export class TransformModule {}
