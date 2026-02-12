import { IntroStatus } from "./intro";

export interface Intro {
  _id: string;
  startupId: string;
  startupName: string;
  investorId: string;
  investorName: string;
  generatedIntro: string;
  followUpDueDate: string;
  status: IntroStatus;
}

export interface Reminder {
  _id: string;
  founderId: string;
  introId: string;
  startupName: string;  
  investorName: string; 
  date: string;
  status: 'queued' | 'sent' | 'completed';
  isOverdue?: boolean;    
  daysRemaining?: number;  
  createdAt: string;
  updatedAt: string;
}
