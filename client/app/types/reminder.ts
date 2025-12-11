export interface Intro {
  _id: string;
  startupId: string;
  startupName: string;
  investorId: string;
  investorName: string;
  generatedIntro: string;
  followUpDueDate: string;
}

export interface Reminder {
  _id: string;
  founderId: string;
  introId: Intro;
  date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
