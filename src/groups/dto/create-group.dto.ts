import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, IsArray } from 'class-validator'
import { Days } from 'src/enums'

export class CreateGroupDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsDateString()
    @IsNotEmpty()
    start_date: Date

    @IsDateString()
    @IsNotEmpty()
    end_date: Date

    @IsString()
    @IsNotEmpty()
    duration: string

    @IsArray()
    @IsEnum(Days, { each: true })
    @IsNotEmpty()
    days: Days[]

    @IsNumber()
    @IsNotEmpty()
    major_id: number

    @IsNumber()
    @IsNotEmpty()
    room_id: number
}