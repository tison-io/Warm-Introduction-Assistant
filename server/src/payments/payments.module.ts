import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Founder, FounderSchema } from 'src/founder/entities/founder.entity';
import { Invoice, InvoiceSchema } from './entities/invoice.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Founder.name, schema: FounderSchema },
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
