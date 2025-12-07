import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntroQueue, IntroQueueSchema } from './entities/intro-queue.schema';
import { TransformService } from './transform.service';
import { TransformController } from './transform.controller';
import { SchedulerModule } from 'src/scheduler/scheduler.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: IntroQueue.name, schema: IntroQueueSchema }]),
    SchedulerModule
  ],
  controllers: [TransformController],
  providers: [TransformService],
})
export class TransformModule {}
