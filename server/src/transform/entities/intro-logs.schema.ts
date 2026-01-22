import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IntroOutcomeLogDocument = IntroOutcomeLog & Document;

@Schema({ timestamps: true })
export class IntroOutcomeLog {
    @Prop({ type: Types.ObjectId, ref: 'IntroQueue', required: true })
    introId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Founder', required: true, index: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Workspace', default: null, index: true })
    workspaceId: Types.ObjectId;

    @Prop({ required: true })
    investorName: string;

    @Prop({ required: true })
    outcome: string;

    @Prop()
    notes?: string;

}

export const IntroOutcomeLogSchema = SchemaFactory.createForClass(IntroOutcomeLog);