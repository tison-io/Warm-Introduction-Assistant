import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Reminder extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Founders', required: true })
  founderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'IntroQueue', required: true })
  introId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ enum: ['queued', 'sent'], default: 'queued' })
  status: 'queued' | 'sent';
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);