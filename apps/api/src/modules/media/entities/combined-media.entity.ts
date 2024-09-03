import { CourseMediaEntity } from './course-media.entity';
import { LessonMediaEntity } from './lesson-media.entity';
import { QuizMediaEntity } from './quiz-media.entity';
import { QuizSubmissionMediaEntity } from './quiz-submission-media.entity';
import { UnitMediaEntity } from './unit-media.entity';
import { UserProfileMediaEntity } from './user-profile-media.entity';

export type CombinedMediaEntity =
  | CourseMediaEntity
  | LessonMediaEntity
  | QuizMediaEntity
  | QuizSubmissionMediaEntity
  | UnitMediaEntity
  | UserProfileMediaEntity;

export const CombinedMediaEntity = [
  CourseMediaEntity,
  LessonMediaEntity,
  QuizMediaEntity,
  QuizSubmissionMediaEntity,
  UnitMediaEntity,
  UserProfileMediaEntity,
] as const;
