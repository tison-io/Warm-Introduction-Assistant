import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Workspace extends Document{
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: true })
    blurb: string;

    @Prop()
    pitchLink: string;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: Types.ObjectId, ref: 'Founder', required: true })
    ownerId: Types.ObjectId;

    @Prop([{
        memberId: { type: Types.ObjectId, ref:'Founder' },
        name: String,
        email: String,
        role: { type: String, enum: ['owner', 'member'], default: 'member'},
        joinedAt: {type: Date, default: Date.now}
    }])
    members: Array<{
        memberId: Types.ObjectId; 
        name: string; 
        email: String; 
        role: string; 
        joinedAt: Date
    }>;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
