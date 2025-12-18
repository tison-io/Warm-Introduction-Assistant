import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvestorDocument = Investor & Document;

@Schema({ timestamps: true })
export class Investor {
  @Prop({ type: Types.ObjectId, ref: 'Founder', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email:string;

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