import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Founder } from 'src/founder/entities/founder.entity';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
    @Prop({ type: Types.ObjectId, ref: 'Founder', required: true })
    founderId: Types.ObjectId;

    @Prop({ required: true })
    stripeSessionId: string;

    @Prop({ required: true })
    amount: string;

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true })
    status: string;

    @Prop()
    receiptUrl: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);