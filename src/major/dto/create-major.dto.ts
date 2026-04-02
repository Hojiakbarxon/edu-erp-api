import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { MajorType } from "src/enums";

export class CreateMajorDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    image: string

    @IsEnum(MajorType)
    @IsNotEmpty()
    type: MajorType
}
