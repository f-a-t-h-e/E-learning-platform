import { Prisma } from '@prisma/client';
import { GetManyQuizzesQueryDto } from '../dto/queries/get-many-quizzes-query.dto';

export const getManyQuizzesForInstructorQuery = (
  query: GetManyQuizzesQueryDto,
) => {
  const params = [
    /*1*/ query.courseId,
    /*2*/ query.quizCursor || Prisma.DbNull,
    /*3*/ (query.quizPageSize || 10) + 1,
    /*4*/ query.quizSkip || 0 + +(typeof query.quizCursor == 'number'),
    /*5*/ query.unitId,
    /*6*/ query.lessonId,
  ];
  const queryString = `
SELECT

qmd.*, q.*

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
      ? `AND q."unitId" = $5 AND q."lessonId" = NULL`
      : `AND q."unitId" = NULL AND q."lessonId" = NULL`
}
)
ORDER BY
    q."order" ${query.quizSkip < 0 ? 'DESC' : 'ASC'}
LIMIT $3
OFFSET $4
`;

  return [queryString, params] as const;
};
