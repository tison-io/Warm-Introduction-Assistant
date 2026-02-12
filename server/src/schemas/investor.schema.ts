import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvestorDocument = Investor & Document;

@Schema({ timestamps: true })
export class Investor {
  @Prop({ type: Types.ObjectId, ref: 'Founder', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', default: null})
  workspaceId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true, index: true, unique: false })
  email:string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ required: true })
  preferred_intro_format: string;

  @Prop()
  intro_preferences_text?: string;

  @Prop()
  notes?: string;

  @Prop({ type: String, enum: ['not-contacted', 'contacted'], default:'not-contacted' })
  status: 'not-contacted' | 'contacted';

  @Prop({ type: Date, default: null})
  contactedAt: Date;
}

export const InvestorSchema = SchemaFactory.createForClass(Investor);