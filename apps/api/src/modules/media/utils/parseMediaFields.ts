import { User } from '@prisma/client';
import { fileTargetMap } from './fileTargetMap';
import { validateField } from 'common/utils/validateField';
import {
  MediaPurposeEnum,
  MediaPurposeTargetEnum,
} from '../media-purpose.enum';

export const parseMediaFields: {
  [K in keyof MediaPurposeEnum]: (
    data: {
      [k in (typeof MediaPurposeTargetEnum)[keyof MediaPurposeEnum]['targetId']]?:
        | string
        | number;
    },
    user: { userId: User['userId'] },
  ) => Parameters<(typeof fileTargetMap)[K]>[0];
} = {
  profile_photo: (data, user) => {
    const userId = user.userId;
    return { userId };
  },
  profile_banner: (data, user) => {
    const userId = user.userId;
    return { userId };
  },
  course_banner: (data, user) => {
    const courseId = validateField(data, 'courseId', 'integer');
    return { courseId };
  },
  course_material: (data, user) => {
    const courseId = validateField(data, 'courseId', 'integer');
    return { courseId };
  },
  unit_banner: (data, user) => {
    const courseId = validateField(data, 'courseId', 'integer');
    const unitId = validateField(data, 'unitId', 'integer');
    return { courseId, unitId };
  },
  unit_material: (data, user) => {
    const courseId = validateField(data, 'courseId', 'integer');
    const unitId = validateField(data, 'unitId', 'integer');
    return { courseId, unitId };
  },
  lesson_banner: (data, user) => {
    const courseId = validateField(data, 'courseId', 'integer');
    const unitId = validateField(data, 'unitId', 'integer');
    const lessonId = validateField(data, 'lessonId', 'integer');
    return { courseId, unitId, lessonId };
  },
  lesson_material: (data, user) => {
    const courseId = validateField(data, 'courseId', 'integer');
    const unitId = validateField(data, 'unitId', 'integer');
    const lessonId = validateField(data, 'lessonId', 'integer');
    return { courseId, unitId, lessonId };
  },
  quiz_banner: (data, user) => {
    const quizId = validateField(data, 'quizId', 'integer');
    const courseId = validateField(data, 'courseId', 'integer');
    let unitId: number | undefined, lessonId: number | undefined;
    if (data.unitId) {
      unitId = validateField(data, 'unitId', 'integer');
      if (data.lessonId) {
        lessonId = validateField(data, 'lessonId', 'integer');
      }
    }
    return { quizId, courseId, unitId, lessonId };
  },
  quiz_material: (data, user) => {
    const quizId = validateField(data, 'quizId', 'integer');
    const courseId = validateField(data, 'courseId', 'integer');
    let unitId: number | undefined, lessonId: number | undefined;
    if (data.unitId) {
      unitId = validateField(data, 'unitId', 'integer');
      if (data.lessonId) {
        lessonId = validateField(data, 'lessonId', 'integer');
      }
    }
    return { quizId, courseId, unitId, lessonId };
  },
  full_quiz_answers: (data, user) => {
    const userId = user.userId;
    const quizId = validateField(data, 'quizId', 'integer');
    const courseId = validateField(data, 'courseId', 'integer');
    let unitId: number | undefined, lessonId: number | undefined;
    if (data.unitId) {
      unitId = validateField(data, 'unitId', 'integer');
      if (data.lessonId) {
        lessonId = validateField(data, 'lessonId', 'integer');
      }
    }
    return { userId, quizId, courseId, unitId, lessonId };
  },
  single_question_answer: (data, user) => {
    const userId = user.userId;
    const quizId = validateField(data, 'quizId', 'integer');
    const courseId = validateField(data, 'courseId', 'integer');
    let unitId: number | undefined, lessonId: number | undefined;
    if (data.unitId) {
      unitId = validateField(data, 'unitId', 'integer');
      if (data.lessonId) {
        lessonId = validateField(data, 'lessonId', 'integer');
      }
    }
    return { userId, quizId, courseId, unitId, lessonId };
  },
  part_of_the_quiz_answers: (data, user) => {
    const userId = user.userId;
    const quizId = validateField(data, 'quizId', 'integer');
    const courseId = validateField(data, 'courseId', 'integer');
    let unitId: number | undefined, lessonId: number | undefined;
    if (data.unitId) {
      unitId = validateField(data, 'unitId', 'integer');
      if (data.lessonId) {
        lessonId = validateField(data, 'lessonId', 'integer');
      }
    }
    return { userId, quizId, courseId, unitId, lessonId };
  },
} as const;
