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
import { PrismaService } from 'common/prisma/prisma.service';
import {
  getCreateAuthDetailsQuery,
  getInstructorAuthForCourseQuery,
  getManyQuizzesForInstructorQuery,
  getStudentAuthPerQuizQuery,
  getStudentAuthQuery,
} from '../sql';
import { Prisma } from '@prisma/client';

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

  async getManyQuizzesForStudentQuery(
    query: GetManyQuizzesQueryDto & { quizPageSize: number },
  ) {
    const params = [
      /*1*/ query.courseId,
      /*2*/ query.quizCursor || Prisma.DbNull,
      /*3*/ query.quizPageSize,
      /*4*/ query.quizSkip || 0 + +(typeof query.quizCursor == 'number'),
      /*5*/ query.unitId || Prisma.DbNull,
      /*6*/ query.lessonId || Prisma.DbNull,
    ];
    const queryString = `
SELECT

q."quizId",
q."courseId",
q."unitId",
q."lessonId",
q."order",
q."state",
q."title",

qmd."startsAt",
qmd."endsAt",
qmd."lateSubmissionDate",
qmd."attemptsAllowed",
qmd."fullGrade",
qmd."type"

FROM "Quiz" AS q
  LEFT JOIN
"QuizMetaData" as qmd
  ON (qmd."quizId" = q."quizId")
WHERE
(
q."courseId" = $1
${query.quizSkip ? (query.quizSkip < 0 ? `AND q."order" <= $2` : `AND q."order >= $2"`) : ''}
${
  query.lessonId
    ? `AND q."lessonId" = $6`
    : query.unitId
      ? `AND q."unitId" = $5 AND q."lessonId" IS NULL`
      : `AND q."unitId" IS NULL AND q."lessonId" IS NULL`
}
)
ORDER BY
    q."order" ${query.quizSkip < 0 ? 'DESC' : 'ASC'}
LIMIT $3
OFFSET $4
`;
    const data = await this.prisma.$queryRawUnsafe<TGetManyQuizzesForStudent[]>(
      queryString,
      ...params,
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
