import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateRoomDto {
    @ApiProperty({ example: 'London' })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: 23 })
    @IsNumber()
    @IsNotEmpty()
    seats: number
}
