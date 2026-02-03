import { IsString, IsArray, MinLength, MaxLength, IsUrl } from 'class-validator';

export class CreateStartupDto {
    @IsString()
    @MinLength(2, { message: 'Startup name is too short' })
    name:string;

    @IsString()
    slug: string;

    @IsString()
    founderName: string;

    @IsString()
    founderEmail: string;

    @IsString()
    @MinLength(50, {
        message: 'Blurb is too short.'
    })
    @MaxLength(500, {
        message: 'Blurb is too long. Keep it concise'
    })
    blurb: string;

    @IsUrl({}, { message: 'Pitch deck must be a valid url.' })
    pitchLink:string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];
}
