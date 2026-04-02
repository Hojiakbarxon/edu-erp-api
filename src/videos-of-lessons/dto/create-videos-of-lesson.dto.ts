import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateVideosOfLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    video: string

    @IsNumber()
    @IsNotEmpty()
    lesson_id: number
}