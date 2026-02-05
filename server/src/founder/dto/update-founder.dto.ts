import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateFounderDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
