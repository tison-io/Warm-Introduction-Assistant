import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Reminder extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Founder', required: true })
  founderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'IntroQueue', required: true })
  introId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ enum: ['queued', 'sent', 'completed'], default: 'queued' })
  status: 'queued' | 'sent' | 'completed';

  @Prop({ type: Types.ObjectId, ref: 'Workspace', default: null })
  workspaceId: Types.ObjectId;
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);