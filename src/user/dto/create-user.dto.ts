import { IsEmail, isNotEmpty, IsNotEmpty, IsNumber, IsString, IsStrongPassword } from "class-validator";
import { Role } from "../entities/user.entity";

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

}
