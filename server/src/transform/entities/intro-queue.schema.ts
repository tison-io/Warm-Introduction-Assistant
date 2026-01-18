import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IntroQueueDocument = IntroQueue & Document;

@Schema({ timestamps:true })
export class IntroQueue {
    @Prop({ type: Types.ObjectId, ref: 'Startup', required: true })
    startupId: Types.ObjectId;

    @Prop({ required:true })
    startupName: string;

    @Prop({ type: Types.ObjectId, ref: 'Investor', required: true })
    investorId: Types.ObjectId; 

    @Prop({ required: true })
    investorName: string;

    @Prop({ required: true })
    investorEmail: string;

    @Prop({ type: Types.ObjectId, ref: 'Founder', required: true })
    founderId: Types.ObjectId; 

    @Prop()
    preferredIntroFormat: string; 

    @Prop()
    introPreferencesText: string;

    @Prop()
    generatedIntro: string;

    @Prop({ default: 'queued'})
    status: 'queued' | 'sent' | 'completed' | 'investor_approval_requested' | 'investor_approved';

    @Prop({ type: Date, default: null })
    followUpDueDate?: Date | null; 

    @Prop({ type: Date, default: null })
    sentDate?: Date | null;

    @Prop({ default: false })
    reminderSent?: boolean;

    @Prop({ default: 0 })
    followUpCount?: number;
}

export const IntroQueueSchema = SchemaFactory.createForClass(IntroQueue);