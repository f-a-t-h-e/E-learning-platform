export const getStudentAuthQuery = ({
  courseId,
  userId,
}: {
  userId: number;
  courseId: number;
}) => {
  const query = `SELECT
  c."state" AS "courseState",
  ce."state" AS "enrollmentState",
  ce."courseEnrollmentId",
  ce."endsAt"
  FROM
    "Course" AS c
  LEFT JOIN
    "CourseEnrollment" AS ce
  ON
    (ce."courseId" = c."courseId" AND ce."studentId" = $1)
  WHERE
    c."courseId" = $2;
`;
  const params = [userId, courseId];

  return [query, params] as const;
};
