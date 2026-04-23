import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateVideosOfLessonDto {
    @ApiProperty({ example: "video of the lesson" })
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    video: string

    @ApiProperty({ example: 7, description: `ID of the lesson which this video belongs to` })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    lesson_id: number
}