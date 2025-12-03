import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvestorDocument = Investor & Document;

@Schema({ timestamps: true })
export class Investor {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  preferred_intro_format: string;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;
}

export const InvestorSchema = SchemaFactory.createForClass(Investor);