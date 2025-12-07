import { IsString, IsOptional } from 'class-validator';

export class CreateStartupDto {
    @IsString()
    name:string;

    @IsString()
    blurb: string;

    @IsString()
    pitchLink:string;
}
