export interface Startup {
  _id: string;
  name: string;
  blurb: string;
  pitchLink: string;
  tags: string[];
  founderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStartupDto {
  name: string;
  blurb: string;
  pitchLink: string;
  tags: string[];
}

export interface UpdateStartupDto {
  name?: string;
  blurb?: string;
  pitchLink?: string;
}
