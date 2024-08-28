import { Injectable } from '@nestjs/common';
import { GetManyQuizzesQueryDto } from '../dto/queries/get-many-quizzes-query.dto';
import {
  TGetCreateAuthDetailsReturn,
  TGetInstructorAuthForCourse,
  TGetInstructorAuthPerQuiz,
  TGetManyQuizzesForInstructor,
  TGetManyQuizzesForStudent,
  TGetStudentAuth,
  TGetStudentAuthPerQuiz,
} from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import {
  getCreateAuthDetailsQuery,
  getInstructorAuthForCourseQuery,
  getManyQuizzesForInstructorQuery,
  getManyQuizzesForStudentQuery,
  getStudentAuthPerQuizQuery,
  getStudentAuthQuery,
} from '../sql';

@Injectable()
export class QuizzesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // INSTRUCTOR QUERIES
  // AUTH
  async getInstructorAuthPerQuizQuery({
    quizId,
    userId,
  }: {
    userId: number;
    quizId: number;
  }) {
    const params = [quizId, userId];
    const query = `SELECT
  q."quizId", c."courseId",
  ci."instructorId", ci."position", ci."state" AS "enrollmentState",
  ci."endsAt", ci."courseInstructorId" AS "courseInstructorId"
FROM
  "Quiz" AS q
LEFT JOIN
  "Course" AS c
ON
  (c."courseId" = q."courseId")
LEFT JOIN
  "CourseInstructor" as ci
ON
  (ci."courseId" = q."courseId" AND ci."instructorId" = $2)
WHERE
  q."quizId" = $1;
`;
    const [data] = await this.prisma.$queryRawUnsafe<
      TGetInstructorAuthPerQuiz[]
    >(query, ...params);

    return data;
  }

  async getInstructorAuthForCourseQuery({
    courseId,
    userId,
  }: {
    courseId: number;
    userId: number;
  }) {
    const [query, params] = getInstructorAuthForCourseQuery({
      courseId,
      userId,
    });
    const [data] = await this.prisma.$queryRawUnsafe<
      TGetInstructorAuthForCourse[]
    >(query, ...params);

    return data;
  }

  async getCreateAuthDetailsQuery(inputs: {
    userId: number;
    courseId: number;
    unitId?: number;
    lessonId?: number;
  }) {
    const [query, params] = getCreateAuthDetailsQuery(inputs);
    const [data] = await this.prisma.$queryRawUnsafe<
      TGetCreateAuthDetailsReturn[]
    >(query, ...params);
    return data;
  }

  async getManyQuizzesForInstructorQuery(query: GetManyQuizzesQueryDto) {
    const [q, params] = getManyQuizzesForInstructorQuery(query);
    const data = await this.prisma.$queryRawUnsafe<
      TGetManyQuizzesForInstructor[]
    >(q, ...params);

    return data;
  }

  async getInstructorOneWithAuth({
    quizId,
    userId,
  }: {
    userId: number;
    quizId: number;
  }) {
    const data = await this.prisma.quiz.findFirst({
      where: { quizId: quizId },
      include: {
        Course: {
          select: {
            state: true,
            Instructors: {
              where: { instructorId: userId },
              select: {
                state: true,
                endsAt: true,
                position: true,
              },
            },
          },
        },
        Questions: {
          include: { Options: true },
        },
        QuizMetaData: true,
      },
    });

    return data;
  }

  async getStudentAuthQuery({
    courseId,
    userId,
  }: {
    userId: number;
    courseId: number;
  }) {
    const [query, params] = getStudentAuthQuery({ courseId, userId });
    const [data] = await this.prisma.$queryRawUnsafe<TGetStudentAuth[]>(
      query,
      ...params,
    );

    return data;
  }

  async getStudentAuthPerQuizQuery(inputs: { userId: number; quizId: number }) {
    const [query, params] = getStudentAuthPerQuizQuery(inputs);

    const [data] = await this.prisma.$queryRawUnsafe<TGetStudentAuthPerQuiz[]>(
      query,
      ...params,
    );

    return data;
  }

  async getManyQuizzesForStudentQuery(query: GetManyQuizzesQueryDto) {
    const [q, p] = getManyQuizzesForStudentQuery(query);
    const data = await this.prisma.$queryRawUnsafe<TGetManyQuizzesForStudent[]>(
      q,
      ...p,
    );
    return data;
  }

  async getStudentOneWithAuth({
    quizId,
    userId,
  }: {
    userId: number;
    quizId: number;
  }) {
    const data = await this.prisma.quiz.findFirst({
      where: { quizId: quizId },
      include: {
        Course: {
          select: {
            state: true,
            Students: {
              where: {
                studentId: userId,
              },
              select: {
                state: true,
                endsAt: true,
              },
            },
          },
        },
        Questions: {
          include: {
            Options: true,
          },
        },
        QuizSubmissions: {
          where: { studentId: userId },
          select: {
            submittedAt: true,
            attempts: true,
            grade: true,
            reviewedAt: true,
            quizId: true,
            createdAt: true,
          },
        },
        QuizMetaData: {
          select: {
            attemptsAllowed: true,
            endsAt: true,
            fullGrade: true,
            lateSubmissionDate: true,
            passGrade: true,
            startsAt: true,
            type: true,
          },
        },
      },
    });
    return data;
  }
}
