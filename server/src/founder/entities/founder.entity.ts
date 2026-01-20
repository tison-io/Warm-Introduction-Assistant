import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FounderDocument = Founder & Document;

@Schema({ timestamps: true })
export class Founder {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, select: false })
  password?: string;

  @Prop({ required: false })
  phone?: string;

  @Prop({ required: false, unique: true, sparse:true })
  googleId?: string;

  @Prop()
  profileImage: string;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: String, enum: ['free', 'pro'], default: 'free' })
  tier: string;

  @Prop({ required: false })
  stripeCustomerId?: string;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop({ default: Date.now })
  lastActive: Date;
}

export const FounderSchema = SchemaFactory.createForClass(Founder);

