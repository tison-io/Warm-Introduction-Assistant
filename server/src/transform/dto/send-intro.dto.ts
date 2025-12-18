import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendIntroDto {
  @IsEmail()
  investorEmail: string;

  @IsNotEmpty()
  @IsString()
  startupName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.replace(/\r?\n/g, '\\n'))
  generatedIntro: string;
}
