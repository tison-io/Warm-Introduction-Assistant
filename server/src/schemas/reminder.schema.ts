import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReminderDocument = Reminder & Document;

@Schema({ timestamps: true })
export class Reminder {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  introId!: Types.ObjectId;

  @Prop({ required: true })
  date!: Date;

  @Prop({ enum: ['pending', 'sent', 'cancelled'], default: 'pending' })
  status!: string;
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);