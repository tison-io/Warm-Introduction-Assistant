import { IntroFormat } from './transform';

export type InvestorStatus = 'not-contacted' | 'contacted';

export type Investor = {
    _id: string;
    userId: string;
    workspaceId?: string;
    name: string;
    email: string;
    tags: string[];
    preferred_intro_format: IntroFormat;
    intro_preferences_text: string;
    notes?: string;
    status: InvestorStatus;
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
  workspaceId?: string;
};

export interface velocityData {
  date: string;
  investorsContacted: number;
}

export type UpdateInvestorDto = Partial<CreateInvestorDto>;