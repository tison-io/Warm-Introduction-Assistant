export interface TransformIntroDto {
    startup_id: string;
    startup_name: string;
    startup_pitch_link: string;
    startup_blurb: string;
    investor_id: string;
    investor_name: string;
    preferred_intro_format: string;
    intro_preferences_text: string;
    founder_id: string;
}

export interface QueueIntroDto {
    startupId: string;
    startupName: string;
    investorId: string;
    investorName: string;
    founderId: string;
    preferredIntroFormat: string;
    introPreferencesText?: string;
    generatedIntro: string;
}