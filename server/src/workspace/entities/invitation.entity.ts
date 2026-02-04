import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Invitation extends Document {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true, unique: true })
    token: string;

    @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
    workspaceId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Founder', required: true })
    invitedBy: Types.ObjectId;

    @Prop({ default: false })
    isAccepted: boolean;

    @Prop({ 
        type: Date, 
        default: Date.now,
    })
    createdAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);