export const getInstructorAuthForCourseQuery = ({
  courseId,
  userId,
}: {
  courseId: number;
  userId: number;
}) => {
  const params = [userId, courseId];
  const query = `SELECT
c."state" AS "courseState",
ce."state" AS "enrollmentState",
ce."courseInstructorId",
ce."position",
ce."endsAt"
FROM
  "Course" AS c
LEFT JOIN
  "CourseInstructor" AS ce
ON
  (ce."courseId" = c."courseId" AND ce."instructorId" = $1)
WHERE
  c."courseId" = $2;
`;
  return [query, params] as const;
};
