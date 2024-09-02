import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizReviewDto } from './create-quiz-review.dto';

export class UpdateQuizReviewDto extends PartialType(CreateQuizReviewDto) {
  id: number;
}
