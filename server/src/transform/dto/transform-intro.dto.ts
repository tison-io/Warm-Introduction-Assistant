import { IsString, IsIn } from "class-validator";

export class TransformIntroDto {
    @IsString()
    blurb: string;

    @IsString()
    @IsIn(["3-bullet-lines", "email"]) //Strict typing
    investor_preference: '3-bullet-lines' | 'email'; 
}