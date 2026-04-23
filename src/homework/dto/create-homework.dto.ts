import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateHomeworkDto {
    @ApiProperty({example : `The homework for this lesson`})
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty({example : 7, description : `The id of the lesson which this homework belongs to`})
    @IsNumber()
    @IsNotEmpty()
    lesson_id: number
}