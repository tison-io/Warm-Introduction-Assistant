import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Founder, FounderSchema } from './entities/founder.entity';
import { FounderService } from './founder.service';
import { FounderController } from './founder.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Founder.name, schema: FounderSchema},
    ]),
  ],
  controllers: [FounderController],
  providers: [FounderService],
})
export class FounderModule {}
