export type IntroFormat = "3-bullet-lines" | "email";

export interface TransformIntroDto {
    startup_id: string;
    startup_name: string;
    startup_pitch_link: string;
    blurb: string; 
    investor_id: string;
    investor_name: string;
    investor_email: string;
    investor_preference: IntroFormat; 
    intro_preferences_text: string;
    founder_id: string;
}

export interface TransformIntroResponse {
    success: true;
    message: string;
    original: {
        blurb: string;
        investor_preference: IntroFormat;
    };
    transformed_intro: string;
}

export interface QueueIntroDto {
    startupId: string;
    startupName: string;
    investorId: string;
    investorName: string;
    investorEmail: string;
    founderId: string;
    preferredIntroFormat: string;
    introPreferencesText?: string;
    generatedIntro: string;
}