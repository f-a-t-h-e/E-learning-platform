import { ForgotPasswordEventEntity } from './forgot-password-event.entity';
import { ReviewQuizEventEntity } from './review-quiz-event.entity';
import { ReviewQuizSubmissionEventEntity } from './review-quiz-submission-event.entity';
import { UserCreatedEventEntity } from './user-created-event.entity';

export type ScheduledTaskDetailsEntity =
  | ReviewQuizEventEntity
  | ReviewQuizSubmissionEventEntity
  | UserCreatedEventEntity
  | ForgotPasswordEventEntity;
