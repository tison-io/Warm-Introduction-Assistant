import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Investor extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ required: true })
  preferred_intro_format: string;

  @Prop({ required: true })
  intro_preferences_text: string;

  @Prop()
  notes?: string;
}

export const InvestorSchema = SchemaFactory.createForClass(Investor);