import { IntroFormat } from './transform';

export type Investor = {
    _id: string;
    userId: string;
    name: string;
    tags: string[];
    preferred_intro_format: IntroFormat;
    intro_preferences_text: string;
    notes?: string;
    createdAt: string;
    updatedAt: string; 
};

export type CreateInvestorDto = {
  name: string;
  tags: string[];
  preferred_intro_format: IntroFormat;
  intro_preferences_text: string;
  notes?: string;
};

// DTO for updating an existing investor
export type UpdateInvestorDto = Partial<CreateInvestorDto>;