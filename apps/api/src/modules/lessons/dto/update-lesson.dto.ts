import { PartialType } from '@nestjs/swagger';
import { PutLessonDto } from './put-lesson.dto';

export class UpdateLessonDto extends PartialType(PutLessonDto) {}
