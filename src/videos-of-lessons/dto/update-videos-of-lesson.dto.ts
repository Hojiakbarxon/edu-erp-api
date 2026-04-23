import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateVideosOfLessonDto } from './create-videos-of-lesson.dto';

export class UpdateVideosOfLessonDto extends PartialType(OmitType(CreateVideosOfLessonDto, ["lesson_id"] as const)) { }
