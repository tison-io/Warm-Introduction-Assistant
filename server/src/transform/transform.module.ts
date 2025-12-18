import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntroQueue, IntroQueueSchema } from './entities/intro-queue.schema';
import { TransformService } from './transform.service';
import { TransformController } from './transform.controller';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: IntroQueue.name, schema: IntroQueueSchema }]),
    SchedulerModule,
    MailModule,
  ],
  controllers: [TransformController],
  providers: [TransformService],
})
export class TransformModule {}
