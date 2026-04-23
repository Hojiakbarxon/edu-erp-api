import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { MajorType } from "src/enums";

export class CreateMajorDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    image: string

    @ApiProperty()
    @IsEnum(MajorType)
    @IsNotEmpty()
    type: MajorType
}
