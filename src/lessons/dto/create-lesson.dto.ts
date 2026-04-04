import { IsString, IsNotEmpty, IsNumber, Matches } from 'class-validator'

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string | undefined

    @IsString()
    @IsNotEmpty()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'start_time must be HH:MM:SS format'
    })
    start_time: string | undefined

    @IsString()
    @IsNotEmpty()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'end_time must be HH:MM:SS format'
    })
    end_time: string | undefined

    @IsNumber()
    @IsNotEmpty()
    group_id: number | undefined
}