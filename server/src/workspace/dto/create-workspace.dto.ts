import { IsNotEmpty, IsString, IsOptional, IsUrl } from "class-validator";

export class CreateWorkspaceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    blurb: string;

    @IsOptional()
    @IsUrl()
    pitchLink?: string;

    @IsOptional()
    @IsString({ each: true })
    tags?: string[];
}

