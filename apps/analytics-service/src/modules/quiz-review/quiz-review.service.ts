import { Injectable } from '@nestjs/common';
import { PrismaService } from 'common/prisma/prisma.service';

@Injectable()
export class QuizReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async reviewQuizById(quizId: number) {
    type T = [{ update_student_grades_and_progress: 1 }];
    const [result] = await this.prisma
      .$queryRaw<T>`SELECT update_student_grades_and_progress(${quizId}::INT);`;

    return result;
  }

  async reviewQuizSubmissionById(quizSubmissionId: number) {
    type T = [{ review_quiz_submission: [0 | 1, number] }];
    // if the result is -1 it means it doesn't need any review
    const [result] = await this.prisma
      .$queryRaw<T>`SELECT review_quiz_submission(${quizSubmissionId}::INT);`;

    return result;
  }
}
