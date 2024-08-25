import { Prisma } from '@prisma/client';

export const getCreateAuthDetailsQuery = ({
  courseId,
  userId,
  lessonId,
  unitId,
}: {
  userId: number;
  courseId: number;
  unitId?: number;
  lessonId?: number;
}) => {
  const params = [
    userId,
    courseId,
    unitId ?? Prisma.DbNull,
    lessonId ?? Prisma.DbNull,
  ];
  // Unit
  let unitJoinPart: string = '';
  let unitSelectPart: string = '';
  if (unitId) {
    unitSelectPart = `,
  u."state" AS "unitState"
`;
    unitJoinPart = `
LEFT JOIN
  "Unit" AS u
  ON (u."courseId" = c."courseId" AND u."unitId" = $3)
`;
  }
  // Lesson
  let lessonJoinPart: string = '';
  let lessonSelectPart: string = '';
  if (lessonId) {
    lessonSelectPart = `,
l."state" AS "lessonState", l."unitId"
`;
    lessonJoinPart = `
LEFT JOIN
  "Lesson" AS l
  ON (l."courseId" = c."courseId" AND l."lessonId" = $4)
`;
  }

  return [
    `SELECT
c."courseId", c."state" AS "courseState",
ci."position", ci."state" AS "instructorState", ci."endsAt" AS "instructorEndsAt"${unitSelectPart}${lessonSelectPart}
FROM "Course" AS c
LEFT JOIN
    "CourseInstructor" AS ci
    ON (ci."courseId" = c."courseId" AND ci."instructorId" = $1)${unitJoinPart}${lessonJoinPart}
WHERE c."courseId" = $2
`,
    params,
  ] as const;
};
