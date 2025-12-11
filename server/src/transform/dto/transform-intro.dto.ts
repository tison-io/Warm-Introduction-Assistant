import { IsString } from "class-validator";

export class TransformIntroDto {
    @IsString()
    blurb: string;

    @IsString()
    investor_preference: string; 
}
