import { PartialType } from '@nestjs/mapped-types';
import { PutLessonDto } from './put-lesson.dto';

export class UpdateLessonDto extends PartialType(PutLessonDto) {}
