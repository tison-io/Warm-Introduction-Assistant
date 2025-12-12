import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IntroQueueDocument = IntroQueue & Document;

@Schema({ timestamps:true })
export class IntroQueue {
    @Prop({ required: true })
    startupId:string;

    @Prop({ required:true })
    startupName:string;

    @Prop({ required: true })
    investorId:string;

    @Prop({ required: true })
    investorName:string;

    @Prop({ required: true })
    founderId:string;

    @Prop()
    prefferedIntroFormat:string;

    @Prop()
    introPreferencesText:string;

    @Prop()
    generatedIntro: string;

    @Prop({ default: 'queued'})
    status: 'queued' | 'sent' | 'completed';

    @Prop({ type: Date, default: null })
    followUpDueDate?: Date; //Only when status = 'sent'

    @Prop({ type: Date, default: null })
    sentDate?: Date;

    @Prop({ default: false })
    reminderSent?: boolean;

    @Prop({ default: 0 })
    followUpCount?: number;
}

export const IntroQueueSchema = SchemaFactory.createForClass(IntroQueue);
