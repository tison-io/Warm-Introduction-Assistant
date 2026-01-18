import { IntroFormat } from './transform';

export type Investor = {
    _id: string;
    userId: string;
    name: string;
    email: string;
    tags: string[];
    preferred_intro_format: IntroFormat;
    intro_preferences_text: string;
    notes?: string;
    createdAt: string;
    updatedAt: string; 
};

export type CreateInvestorDto = {
  name: string;
  email: string;
  tags: string[];
  preferred_intro_format: IntroFormat;
  intro_preferences_text: string;
  notes?: string;
};

export interface velocityData {
  date: string;
  investorsContacted: number;
}

export type UpdateInvestorDto = Partial<CreateInvestorDto>;