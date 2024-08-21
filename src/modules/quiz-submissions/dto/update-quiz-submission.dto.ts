import { PartialType } from '@nestjs/swagger';
import { CreateQuizSubmissionDto } from './create-quiz-submission.dto';

export class UpdateQuizSubmissionDto extends PartialType(
  CreateQuizSubmissionDto,
) {}
