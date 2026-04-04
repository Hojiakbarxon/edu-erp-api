import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateVideosOfLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsOptional()
    video: string

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    lesson_id: number
}