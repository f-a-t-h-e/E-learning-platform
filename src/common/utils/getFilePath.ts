import { Course, Lesson, Unit, User } from '@prisma/client';
import { join } from 'path';
export function getFilePath({
  extension,
  mediaId,
  userId,
}: {
  userId: number;
  mediaId: number;
  extension: string;
}) {
  return join(process.cwd(), 'uploads', `${userId}_${mediaId}.${extension}`);
}

export const getFileTargetPart = (n: number) => {
  // 5000 file/folder per folder
  return Math.floor(n / 5000);
};

export const fileTargetMap = {
  PROFILE_PICTURE: (userId: User['id']) => {
    return [
      'uploads',
      'user-profile',
      getFileTargetPart(userId).toString(),
      userId.toString(),
      'photo',
    ];
  },
  PROFILE_BANNER: (userId: User['id']) => {
    return [
      'uploads',
      'user-profile',
      getFileTargetPart(userId).toString(),
      userId.toString(),
      'banner',
    ];
  },
  COURSE_BANNER: (courseId: Course['id']) => {
    return [
      'uploads',
      'course',
      getFileTargetPart(courseId).toString(),
      courseId.toString(),
      'banner',
    ];
  },
  COURSE_MATERIAL: (courseId: Course['id']) => {
    return [
      'uploads',
      'course',
      getFileTargetPart(courseId).toString(),
      courseId.toString(),
      'material',
    ];
  },
  UNIT_BANNER: (courseId: Course['id'], unitId: Unit['id']) => {
    return [
      'uploads',
      'course',
      getFileTargetPart(courseId).toString(),
      courseId.toString(),
      'unit',
      // getFileTargetPart(unitId).toString(),
      unitId.toString(),
      'banner',
    ];
  },
  UNIT_MATERIAL: (courseId: Course['id'], unitId: Unit['id']) => {
    return [
      'uploads',
      'course',
      getFileTargetPart(courseId).toString(),
      courseId.toString(),
      'unit',
      // getFileTargetPart(unitId).toString(),
      unitId.toString(),
      'material',
    ];
  },
  LESSON_BANNER: (
    courseId: Course['id'],
    unitId: Unit['id'],
    lessonId: Lesson['id'],
  ) => {
    return [
      'uploads',
      'course',
      getFileTargetPart(courseId).toString(),
      courseId.toString(),
      'unit',
      // getFileTargetPart(unitId).toString(),
      unitId.toString(),
      'lesson',
      // getFileTargetPart(lessonId).toString(),
      lessonId.toString(),
      'banner',
    ];
  },
  LESSON_MATERIAL: (
    courseId: Course['id'],
    unitId: Unit['id'],
    lessonId: Lesson['id'],
  ) => {
    return [
      'uploads',
      'course',
      getFileTargetPart(courseId).toString(),
      courseId.toString(),
      'unit',
      // getFileTargetPart(unitId).toString(),
      unitId.toString(),
      'lesson',
      // getFileTargetPart(lessonId).toString(),
      lessonId.toString(),
      'material',
    ];
  },
} as const;
