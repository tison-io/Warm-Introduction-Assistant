import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateInvestorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsString()
  @IsNotEmpty()
  preferred_intro_format!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}