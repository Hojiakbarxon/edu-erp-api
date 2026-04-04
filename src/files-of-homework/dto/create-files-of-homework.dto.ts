import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateFilesOfHomeworkDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsOptional()
    file: string

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    homework_id: number
}