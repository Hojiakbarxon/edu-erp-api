import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateHomeworkDto {
    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    @IsNotEmpty()
    lesson_id: number
}