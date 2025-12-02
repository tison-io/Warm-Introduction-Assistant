import {IsEmail, IsNotEmpty, MinLength} from "class-validator";
export class CreateFounderDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;
    
    @MinLength(6)
    password: string;
}
