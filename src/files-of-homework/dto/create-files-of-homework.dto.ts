import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateFilesOfHomeworkDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    file: string

    @IsNumber()
    @IsNotEmpty()
    homework_id: number
}