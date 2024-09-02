import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { QuizReviewService } from './quiz-review.service';
import { Channels_Enum } from 'common/enums/channels.enum';
import { ReviewQuizEventEntity } from 'common/entities/review-quiz-event.entity';
import { ReviewQuizSubmissionEventEntity } from 'common/entities/review-quiz-submission-event.entity';

@Controller()
export class QuizReviewController {
  constructor(private readonly quizReviewService: QuizReviewService) {}

  @EventPattern(Channels_Enum.review_quiz)
  async reviewQuiz(data: ReviewQuizEventEntity['data']) {
    const result = await this.quizReviewService.reviewQuizById(data);

    console.log(result);
  }

  @EventPattern(Channels_Enum.review_quiz_submission)
  async reviewQuizSubmission(data: ReviewQuizSubmissionEventEntity['data']) {
    const result = await this.quizReviewService.reviewQuizSubmissionById(data);

    console.log(result);
  }
}
