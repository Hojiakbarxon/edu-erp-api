import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateLessonDto } from './create-lesson.dto';

export class UpdateLessonDto extends PartialType(
    OmitType(CreateLessonDto, ['group_id'] as const)
) { }
