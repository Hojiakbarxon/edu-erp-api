import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsStrongPassword()
    @IsNotEmpty()
    new_password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    otp: string
}