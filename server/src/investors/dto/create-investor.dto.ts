import { IsString, IsNotEmpty, IsArray, IsOptional, IsEmail, ArrayMinSize, ArrayMaxSize, IsIn } from 'class-validator';
import { VALID_TAGS } from 'src/startups/dto/create-startup.dto';

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
  @ArrayMinSize(2, { message: 'Select at least 2 investor tags' })
  @ArrayMaxSize(5, { message: 'You can select a maximum of 5 tags' })
  @IsIn(VALID_TAGS, { 
    each: true, 
    message: (args) => `Invalid tag: ${args.value}. Choose from: ${VALID_TAGS.join(', ')}` 
  })
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