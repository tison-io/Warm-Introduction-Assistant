import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StartupDocument = Startup & Document;

@Schema({ timestamps: true })
export class Startup {
    @Prop({ required:true })
    name:string;

    @Prop({ required: true, unique: true }) //For public urls
    slug: string;

    @Prop({ required: true })
    founderName: string;

    @Prop({ required: true })
    founderEmail: string;

    @Prop({ required:true })
    blurb:string;

    @Prop()
    pitchLink: string;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: Types.ObjectId, ref:'Founder', required:true })
    founderId:Types.ObjectId;
}

export const StartupSchema = SchemaFactory.createForClass(Startup);