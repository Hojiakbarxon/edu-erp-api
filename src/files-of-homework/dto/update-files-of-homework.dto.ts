import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFilesOfHomeworkDto } from './create-files-of-homework.dto';

export class UpdateFilesOfHomeworkDto extends PartialType(OmitType(CreateFilesOfHomeworkDto, ['homework_id'] as const)
) { }
