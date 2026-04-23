import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, Matches } from 'class-validator'

export class CreateLessonDto {
    @ApiProperty({example : "Introduction to programming"})
    @IsString()
    @IsNotEmpty()
    title: string | undefined

    @ApiProperty({example : "04:30:00"})
    @IsString()
    @IsNotEmpty()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'start_time must be HH:MM:SS format'
    })
    start_time: string | undefined

    @ApiProperty({example : "08:30:00"})
    @IsString()
    @IsNotEmpty()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'end_time must be HH:MM:SS format'
    })
    end_time: string | undefined

    @ApiProperty({example : 2, description : `This is the id of the group which the lesson belongs to`})
    @IsNumber()
    @IsNotEmpty()
    group_id: number | undefined
}