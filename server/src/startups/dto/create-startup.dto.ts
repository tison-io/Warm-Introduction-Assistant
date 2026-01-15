import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateStartupDto {
    @IsString()
    name:string;

    @IsString()
    blurb: string;

    @IsString()
    pitchLink:string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];
}
