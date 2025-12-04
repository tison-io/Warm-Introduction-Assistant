export interface Startup {
  _id: string;
  name: string;
  blurb: string;
  pitchLink: string;       
  founderId: string;   
  introsCreated?: number;  
  investors?: number;    
  createdAt: string;
  updatedAt: string;
  __v?: number; 
}

export interface CreateStartupInput {
  name: string;
  blurb: string;
  pitchLink: string;
}

export interface UpdateStartupInput {
  name?: string;
  blurb?: string;
  pitchLink?: string;
}

export type StartupResponse = Startup;
export type StartupListResponse = Startup[];
