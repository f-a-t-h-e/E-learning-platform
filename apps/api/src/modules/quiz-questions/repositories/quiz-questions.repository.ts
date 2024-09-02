import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { strOrNothing } from 'apps/api/src/common/utils/strOrNothing';
import { PrismaService } from 'common/prisma/prisma.service';
import { TGetQuestionsDetailsForStudentWithAuth } from '../types';

@Injectable()
export class QuizQuestionRepository {
  private questionFields: {
    [k in keyof typeof this.prisma.quizQuestion.fields]: string;
  };
  constructor(private readonly prisma: PrismaService) {
    this.questionFields = Object.entries(
      this.prisma.quizQuestion.fields,
    ).reduce(
      (obj, [f, { name }]) => {
        obj[f] = name;
        return obj;
      },
      {} as typeof this.questionFields,
    );
  }

  async getQuestionsDetailsForStudentWithAuth({
    includeStudentAnswer,
    includeCorrectAnswer,
    includeCourse,
    includeOptions,
    questionId,
    studentId,
  }: {
    questionId: number;
    studentId: number;
    includeOptions?: boolean;
    includeStudentAnswer?: boolean;
    includeCourse?: boolean;
    includeCorrectAnswer?: boolean;
  }) {
    const condition = `qq.${this.questionFields.quizQuestionId} = $1`;
    const select = `
qq."${this.questionFields.quizId}" AS "quizId",
${includeCorrectAnswer ? `qq."${this.questionFields.correctAnswer}" AS "correctAnswer",` : ``}
qq."${this.questionFields.order}" AS "order",
qq."${this.questionFields.fullGrade}" AS "fullGrade",
qq."${this.questionFields.passGrade}" AS "passGrade",
qq."${this.questionFields.questionType}" AS "questionType",
qq."${this.questionFields.questionText}" AS "questionText",
q."${this.prisma.quiz.fields.courseId.name}" AS "courseId",
qmd."${this.prisma.quizMetaData.fields.type.name}" AS "quizType",
qmd."${this.prisma.quizMetaData.fields.startsAt.name}" AS "quizStartsAt",
qmd."${this.prisma.quizMetaData.fields.endsAt.name}" AS "quizEndsAt",
ci."${this.prisma.courseEnrollment.fields.state.name}" AS "enrollmentState",
ci."${this.prisma.courseEnrollment.fields.endsAt.name}" AS "enrollmentEndsAt"${strOrNothing(
      includeCourse,
      `,
c."state" AS "courseState"`,
    )}${strOrNothing(
      includeStudentAnswer,
      `,
sa."quizAnswerId" AS "quizAnswerId",
sa."answer" AS "studentAnswer",
sa."chosenOptionId" AS "chosenOptionId",
sa."grade" AS "answerGrade"`,
    )}
`;
    const joins = `
LEFT JOIN "${Prisma.ModelName.Quiz}" AS q
ON (q."${this.prisma.quiz.fields.quizId.name}" = qq."${this.questionFields.quizId}")
LEFT JOIN "${Prisma.ModelName.QuizMetaData}" AS qmd
ON (qmd."${this.prisma.quizMetaData.fields.quizId.name}" = q."${this.prisma.quiz.fields.quizId.name}")
LEFT JOIN "${Prisma.ModelName.CourseEnrollment}" AS ci
ON (
ci."${this.prisma.courseEnrollment.fields.courseId.name}" = q."${this.prisma.quiz.fields.courseId.name}"
AND
ci."${this.prisma.courseEnrollment.fields.studentId.name}" = $2
)
${strOrNothing(
  includeCourse,
  `LEFT JOIN "${Prisma.ModelName.Course}" AS c
ON (c."${this.prisma.course.fields.courseId.name}" = q."${this.prisma.quiz.fields.courseId.name}")`,
)}
${strOrNothing(
  includeStudentAnswer,
  `LEFT JOIN "${Prisma.ModelName.QuizAnswer}" AS sa
ON (sa."${this.prisma.quizAnswer.fields.questionId.name}" = qq."${this.questionFields.quizQuestionId}")
`,
)}
`;
    const query = `SELECT
${select}
FROM "${Prisma.ModelName.QuizQuestion}" AS q
${joins}
WHERE
(${condition})
`;
    const params = [/*1*/ questionId, /*2*/ studentId];
    const [data] = await this.prisma.$queryRawUnsafe<
      [TGetQuestionsDetailsForStudentWithAuth]
    >(query, ...params);
    if (!data) {
      return null;
    }
    if (includeOptions) {
      const options = await this.prisma.quizQuestionOption.findMany({
        where: { questionId: questionId },
      });
      // @ts-expect-error
      data.Options = options;
      return data as typeof data & { Options: typeof options };
    }
    return data as typeof data & { Options?: undefined };
  }
}
