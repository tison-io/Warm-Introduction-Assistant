export interface FounderSignupInput {
    name:string;
    email:string;
    phone:string;
    password:string;
}

export interface FounderResponse {
    id:string;
    name:string;
    email:string;
    phone?:string;
    createdAt:string;
    tier: string;
}

export interface FounderLoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    tier: string;
  };
}

export type FounderUpdateInput = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
};
