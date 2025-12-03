import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateInvestorDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags!: string[];

  @IsString({ message: 'Preferred intro format must be a string' })
  @IsNotEmpty({ message: 'Preferred intro format is required' })
  preferred_intro_format!: string;

  @IsString({ message: 'Notes must be a string' })
  @IsOptional()
  notes?: string;
}