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
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const FounderSchema = SchemaFactory.createForClass(Founder);

