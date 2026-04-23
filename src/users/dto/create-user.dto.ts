import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsEmail, MinLength, IsStrongPassword } from 'class-validator'

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    full_name: string

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    username?: string

    @ApiProperty()
    @IsStrongPassword()
    @IsNotEmpty()
    password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone_number: string

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    image?: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    age: number

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email?: string
}