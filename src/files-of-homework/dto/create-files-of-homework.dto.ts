import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateFilesOfHomeworkDto {
    @ApiProperty({example : `The files of the homework`})
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    file: string

    @ApiProperty({example : 6, description : `ID of the homework this file belongs to`})
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    homework_id: number
}