import { IsString, IsNotEmpty, IsArray, IsOptional, IsEmail } from 'class-validator';

export class CreateInvestorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsString()
  @IsNotEmpty()
  preferred_intro_format!: string;

  @IsString()
  @IsNotEmpty()
  intro_preferences_text!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}