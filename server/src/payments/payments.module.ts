import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Founder, FounderSchema } from 'src/founder/entities/founder.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Founder.name, schema: FounderSchema }]),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
