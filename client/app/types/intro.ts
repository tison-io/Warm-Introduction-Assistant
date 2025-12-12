// types/intro.ts

export type IntroStatus = 'queued' | 'sent' | 'completed';

export interface IntroQueue {
    _id: string; // MongoDB ID for the intro record
    startupId: string;
    startupName: string;
    investorId: string;
    investorName: string;
    founderId: string;
    preferredIntroFormat: string;
    introPreferencesText?: string;
    generatedIntro: string; // The draft content
    status: IntroStatus;
    sentDate?: Date | string;
    followUpDueDate?: Date | string;
    reminderSent: boolean;
    followUpCount: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface StatusUpdatePayload {
    status: IntroStatus;
    followUpDueDate?: Date;
}