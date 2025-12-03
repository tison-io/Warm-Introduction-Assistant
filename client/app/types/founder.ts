export interface FounderSignupInput {
    name:string;
    email:string;
    password:string;
}

export interface FounderResponse {
    id:string;
    name:string;
    email:string;
    createdAt:string;
}