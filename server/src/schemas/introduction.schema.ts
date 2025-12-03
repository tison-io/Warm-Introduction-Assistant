import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Introduction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  recipientName: string;

  @Prop({ required: true })
  recipientEmail: string;

  @Prop({ required: true })
  message: string;

  @Prop({ enum: ['draft', 'sent', 'scheduled'], default: 'draft' })
  status: string;

  @Prop()
  scheduledDate?: Date;
}

export const IntroductionSchema = SchemaFactory.createForClass(Introduction);