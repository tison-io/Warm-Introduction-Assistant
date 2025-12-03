import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

<<<<<<< HEAD
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

  @Prop()
  notes?: string;
=======
export type InvestorDocument = Investor & Document;

@Schema({ timestamps: true })
export class Investor {
  @Prop({ required: true })
  name!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ required: true })
  preferred_intro_format!: string;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId!: Types.ObjectId;
>>>>>>> feature/investors
}

export const InvestorSchema = SchemaFactory.createForClass(Investor);