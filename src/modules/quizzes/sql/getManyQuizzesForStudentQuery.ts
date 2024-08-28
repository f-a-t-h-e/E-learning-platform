import { Prisma } from '@prisma/client';
import { GetManyQuizzesQueryDto } from '../dto/queries/get-many-quizzes-query.dto';

export const getManyQuizzesForStudentQuery = (
  query: GetManyQuizzesQueryDto,
) => {
  const params = [
    /*1*/ query.courseId,
    /*2*/ query.quizCursor || Prisma.DbNull,
    /*3*/ (query.quizPageSize || 10) + 1,
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

  return [queryString, params] as const;
};
