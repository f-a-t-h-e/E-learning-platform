import { $Enums, Course, Lesson, Quiz, Unit, User } from '@prisma/client';
import { UPLOADS_FOLDER } from 'common/constants';
import { GetPathForQuiz, GetPathForQuizSubmission } from './types';

export const getFileTargetPart = (n: number): number[] => {
  // 5000 file/folder per folder
  const v = Math.floor(n / 5000);
  if (v > 4999) {
    return [5000, ...getFileTargetPart(v)];
  }
  return [v];
};

export type MediaPurposeFunctionMap = {
  [key in $Enums.UserProfileMediaPurpose]: (data: {
    userId: number;
  }) => string[];
} & {
  [key in $Enums.CourseMediaPurpose]: (data: { courseId: number }) => string[];
} & {
  [key in $Enums.UnitMediaPurpose]: (data: {
    courseId: number;
    unitId: number;
  }) => string[];
} & {
  [key in $Enums.LessonMediaPurpose]: (data: {
    courseId: number;
    unitId: number;
    lessonId: number;
  }) => string[];
} & {
  [key in $Enums.QuizMediaPurpose]: GetPathForQuiz;
} & {
  [key in $Enums.QuizSubmissionMediaPurpose]: GetPathForQuizSubmission;
};

export const fileTargetMap: MediaPurposeFunctionMap = {
  profile_banner: (data: { userId: User['userId'] }) => {
    return [
      UPLOADS_FOLDER,
      'user-profile',
      ...getFileTargetPart(data.userId).map((v) => v.toString()),
      data.userId.toString(),
      'banner',
    ];
  },
  profile_photo: (data: { userId: User['userId'] }) => {
    return [
      UPLOADS_FOLDER,
      'user-profile',
      ...getFileTargetPart(data.userId).map((v) => v.toString()),
      data.userId.toString(),
      'photo',
    ];
  },
  course_banner: (data: { courseId: Course['courseId'] }) => {
    return [
      UPLOADS_FOLDER,
      'course',
      ...getFileTargetPart(data.courseId).map((v) => v.toString()),
      data.courseId.toString(),
      'banner',
    ];
  },
  course_material: (data: { courseId: Course['courseId'] }) => {
    return [
      UPLOADS_FOLDER,
      'course',
      ...getFileTargetPart(data.courseId).map((v) => v.toString()),
      data.courseId.toString(),
      'material',
    ];
  },
  unit_banner: (data: {
    courseId: Course['courseId'];
    unitId: Unit['unitId'];
  }) => {
    return [
      UPLOADS_FOLDER,
      'course',
      ...getFileTargetPart(data.courseId).map((v) => v.toString()),
      data.courseId.toString(),
      'unit',
      data.unitId.toString(),
      'banner',
    ];
  },
  unit_material: (data: {
    courseId: Course['courseId'];
    unitId: Unit['unitId'];
  }) => {
    return [
      UPLOADS_FOLDER,
      'course',
      ...getFileTargetPart(data.courseId).map((v) => v.toString()),
      data.courseId.toString(),
      'unit',
      data.unitId.toString(),
      'material',
    ];
  },
  lesson_banner: (data: {
    courseId: Course['courseId'];
    unitId: Unit['unitId'];
    lessonId: Lesson['lessonId'];
  }) => {
    return [
      UPLOADS_FOLDER,
      'course',
      ...getFileTargetPart(data.courseId).map((v) => v.toString()),
      data.courseId.toString(),
      'unit',
      data.unitId.toString(),
      'lesson',
      data.lessonId.toString(),
      'banner',
    ];
  },
  lesson_material: (data: {
    courseId: Course['courseId'];
    unitId: Unit['unitId'];
    lessonId: Lesson['lessonId'];
  }) => {
    return [
      UPLOADS_FOLDER,
      'course',
      ...getFileTargetPart(data.courseId).map((v) => v.toString()),
      data.courseId.toString(),
      'unit',
      data.unitId.toString(),
      'lesson',
      data.lessonId.toString(),
      'material',
    ];
  },
  quiz_banner: (data: {
    quizId: number;
    courseId: number;
    unitId?: number;
    lessonId?: number;
  }) => {
    const pathsArr = [
      UPLOADS_FOLDER,
      'course',
      ...getFileTargetPart(data.courseId).map((v) => v.toString()),
      data.courseId.toString(),
    ];
    if (data.unitId) {
      pathsArr.push('unit', data.unitId.toString());
    }
    if (data.lessonId) {
      pathsArr.push('lesson', data.lessonId.toString());
    }
    pathsArr.push('quiz', data.quizId.toString(), 'banner');
    return pathsArr;
  },
  quiz_material: (data: {
    quizId: Quiz['quizId'];
    courseId: number;
    unitId?: number;
    lessonId?: number;
  }) => {
    const pathsArr = [
      UPLOADS_FOLDER,
      'course',
      ...getFileTargetPart(data.courseId).map((v) => v.toString()),
      data.courseId.toString(),
    ];
    if (data.unitId) {
      pathsArr.push('unit', data.unitId.toString());
    }
    if (data.lessonId) {
      pathsArr.push('lesson', data.lessonId.toString());
    }
    pathsArr.push('quiz', data.quizId.toString(), 'material');
    return pathsArr;
  },
  full_quiz_answers: (data: {
    userId: number;
    quizId: Quiz['quizId'];
    courseId: number;
    unitId?: number;
    lessonId?: number;
  }) => {
    const pathsArr = [
      UPLOADS_FOLDER,
      'course',
      ...getFileTargetPart(data.courseId).map((v) => v.toString()),
      data.courseId.toString(),
    ];
    if (data.unitId) {
      pathsArr.push('unit', data.unitId.toString());
    }
    if (data.lessonId) {
      pathsArr.push('lesson', data.lessonId.toString());
    }
    pathsArr.push(
      'quiz',
      data.quizId.toString(),
      'answers',
      'full',
      ...getFileTargetPart(data.userId).map((v) => v.toString()),
    );
    return pathsArr;
  },
  single_question_answer: (data: {
    userId: number;
    quizId: Quiz['quizId'];
    courseId: number;
    unitId?: number;
    lessonId?: number;
  }) => {
    const pathsArr = [
      UPLOADS_FOLDER,
      'course',
      ...getFileTargetPart(data.courseId).map((v) => v.toString()),
      data.courseId.toString(),
    ];
    if (data.unitId) {
      pathsArr.push('unit', data.unitId.toString());
    }
    if (data.lessonId) {
      pathsArr.push('lesson', data.lessonId.toString());
    }
    pathsArr.push(
      'quiz',
      data.quizId.toString(),
      'answers',
      'single-question',
      ...getFileTargetPart(data.userId).map((v) => v.toString()),
    );
    return pathsArr;
  },
  part_of_the_quiz_answers: (data: {
    userId: number;
    quizId: Quiz['quizId'];
    courseId: number;
    unitId?: number;
    lessonId?: number;
  }) => {
    const pathsArr = [
      UPLOADS_FOLDER,
      'course',
      ...getFileTargetPart(data.courseId).map((v) => v.toString()),
      data.courseId.toString(),
    ];
    if (data.unitId) {
      pathsArr.push('unit', data.unitId.toString());
    }
    if (data.lessonId) {
      pathsArr.push('lesson', data.lessonId.toString());
    }
    pathsArr.push(
      'quiz',
      data.quizId.toString(),
      'answers',
      'part',
      ...getFileTargetPart(data.userId).map((v) => v.toString()),
    );
    return pathsArr;
  },
} as const;
