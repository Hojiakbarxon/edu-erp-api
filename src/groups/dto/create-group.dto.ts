import { ApiOperation, ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, IsArray } from 'class-validator'
import { Days } from 'src/enums'

export class CreateGroupDto {
    @ApiProperty({ example: "Backend node.js" })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: "2026-01-04" })
    @IsDateString()
    @IsNotEmpty()
    start_date: Date

    @ApiProperty({ example: "2026-01-09" })
    @IsDateString()
    @IsNotEmpty()
    end_date: Date

    @ApiProperty({ example: "04:00:00" })
    @IsString()
    @IsNotEmpty()
    duration: string

    @ApiProperty({ enum: Days, enumName: "Days" })
    @IsArray()
    @IsEnum(Days, { each: true })
    @IsNotEmpty()
    days: Days[]

    @ApiProperty({ example: 1, description: `The id of the major for the group` })
    @IsNumber()
    @IsNotEmpty()
    major_id: number

    @ApiProperty({ example: 3, description: `The id of the room for this group` })
    @IsNumber()
    @IsNotEmpty()
    room_id: number
}