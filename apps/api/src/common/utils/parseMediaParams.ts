import { User } from '@prisma/client';
import { fileTargetMap } from './getFilePath';
import { validateField } from './validateField';

type TParameters = {
  params: { [k: string]: string };
  user: { userId: User['userId'] };
};

export const parseMediaParams: {
  [K in keyof typeof fileTargetMap]: (
    req: TParameters,
  ) => Parameters<(typeof fileTargetMap)[K]>;
} = {
  PROFILE_PICTURE: (req: TParameters) => {
    const userId = req.user.userId;

    return [userId];
  },
  PROFILE_BANNER: (req: TParameters) => {
    const userId = req.user.userId;

    return [userId];
  },
  COURSE_BANNER: (req: TParameters) => {
    const courseId = validateField(req.params, 'courseId', 'integer');

    return [courseId];
  },
  COURSE_MATERIAL: (req: TParameters) => {
    const courseId = validateField(req.params, 'courseId', 'integer');

    return [courseId];
  },
  UNIT_BANNER: (req: TParameters) => {
    const courseId = validateField(req.params, 'courseId', 'integer');
    const unitId = validateField(req.params, 'unitId', 'integer');

    return [courseId, unitId];
  },
  UNIT_MATERIAL: (req: TParameters) => {
    const courseId = validateField(req.params, 'courseId', 'integer');
    const unitId = validateField(req.params, 'unitId', 'integer');

    return [courseId, unitId];
  },
  LESSON_BANNER: (req: TParameters) => {
    const courseId = validateField(req.params, 'courseId', 'integer');
    const unitId = validateField(req.params, 'unitId', 'integer');
    const lessonId = validateField(req.params, 'lessonId', 'integer');

    return [courseId, unitId, lessonId];
  },
  LESSON_MATERIAL: (req: TParameters) => {
    const courseId = validateField(req.params, 'courseId', 'integer');
    const unitId = validateField(req.params, 'unitId', 'integer');
    const lessonId = validateField(req.params, 'lessonId', 'integer');

    return [courseId, unitId, lessonId];
  },
} as const;
