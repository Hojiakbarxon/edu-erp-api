import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateHomeworkDto } from './create-homework.dto';

export class UpdateHomeworkDto extends PartialType(
    OmitType(CreateHomeworkDto, ['lesson_id'] as const)
) { }
