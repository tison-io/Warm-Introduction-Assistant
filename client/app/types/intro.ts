// types/intro.ts

export type IntroStatus = 'queued' | 'sent' | 'completed' | 'investor_approval_requested' | 'investor_approved';

export interface IntroQueue {
    _id: string;
    startupId: string;
    startupName: string;
    investorId: string;
    investorName: string;
    investorEmail: string;
    founderId: string; 
    founderName: string;
    founderEmail: string;
    preferredIntroFormat: string;
    introPreferencesText?: string;
    generatedIntro: string;
    status: IntroStatus;
    sentDate?: Date | string;
    followUpDueDate?: Date | string;
    reminderSent: boolean;
    followUpCount: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface StatusUpdatePayload {
    status?: IntroStatus;
    followUpDueDate?: Date;
}

export interface ExecutionRateResponse {
    executionRate: number;
}

export interface OutcomeLog {
    _id:string;
    userId: string;
    workspaceId?: string | null;
    investorName: string;
    outcome:string;
    notes: string;
    createdAt: string;
}

export interface PaginatedIntroResponse {
    data: IntroQueue[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
        hasNextPage: boolean;
    };
}