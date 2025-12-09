import { IsString } from "class-validator";

export class TransformIntroDto {
    @IsString()
    startup_id: string;

    @IsString()
    startup_name: string;

    @IsString()
    startup_pitch_link: string;

    @IsString()
    startup_blurb: string;

    @IsString()
    investor_id: string;

    @IsString()
    investor_name: string;

    @IsString()
    preferred_intro_format: string;

    @IsString()
    intro_preferences_text: string;

    @IsString()
    founder_id: string; 
}
