import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntroQueue, IntroQueueSchema } from './entities/intro-queue.schema';
import { TransformService } from './transform.service';
import { TransformController } from './transform.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: IntroQueue.name, schema: IntroQueueSchema }])
  ],
  controllers: [TransformController],
  providers: [TransformService],
})
export class TransformModule {}
