export interface Startup {
  _id: string;
  name: string;
  founderName: string;
  founderEmail: string;
  blurb: string;
  pitchLink: string;
  tags: string[];
  founderId: string;
  createdAt: string;
  updatedAt: string;
}

export const VALID_TAGS = [
  'SaaS', 
  'Fintech', 
  'AI/ML', 
  'Healthtech', 
  'Edtech', 
  'E-commerce', 
  'Blockchain', 
  'B2B', 
  'B2C', 
  'Agritech', 
  'Cybersecurity', 
  'Web3'
] as const;

export interface CreateStartupDto {
  name: string;
  founderName: string;
  founderEmail: string;
  blurb: string;
  pitchLink: string;
  tags: string[];
  founderId: string;
}

export interface UpdateStartupDto {
  name?: string;
  blurb?: string;
  pitchLink?: string;
}
