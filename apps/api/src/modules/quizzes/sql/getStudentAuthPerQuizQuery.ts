export const getStudentAuthPerQuizQuery = ({
  quizId,
  userId,
}: {
  userId: number;
  quizId: number;
}) => {
  const query = `SELECT
 q."state" AS "quizState",
 c."state" AS "courseState",
 ce."state" AS "enrollmentState",
 ce."courseEnrollmentId",
 ce."endsAt"
FROM
  "Quiz" AS q
LEFT JOIN
  "CourseEnrollment" AS ce
ON
  (ce."courseId" = q."courseId" AND ce."studentId" = $1)
LEFT JOIN
  "Course" AS c
ON
  (c."courseId" = q."courseId")
WHERE
  q."quizId" = $2;
`;
  const params = [userId, quizId];

  return [query, params] as const;
};
