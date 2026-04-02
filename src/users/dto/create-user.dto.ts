import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsEmail, MinLength, IsStrongPassword } from 'class-validator'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    full_name: string

    @IsString()
    @IsOptional()
    username?: string

    @IsStrongPassword()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    phone_number: string

    @IsString()
    @IsOptional()
    image?: string

    @IsNumber()
    @IsNotEmpty()
    age: number

    @IsEmail()
    @IsOptional()
    email?: string
}