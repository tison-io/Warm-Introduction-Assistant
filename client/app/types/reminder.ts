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
  introId: Intro;
  date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isCompleted?: boolean;
}
