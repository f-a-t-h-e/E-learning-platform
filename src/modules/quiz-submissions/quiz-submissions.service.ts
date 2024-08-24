import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CourseEnrollmentState,
  CourseState,
  Prisma,
  Quiz,
  QuizQuestion,
  QuizState,
  QuizSubmission,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizSubmissionDto } from './dto/create-quiz-submission.dto';
import { UpdateQuizSubmissionDto } from './dto/update-quiz-submission.dto';
import { FieldsOrNullFields } from 'src/common/utils/types';
import { CreateQuizAnswerDto } from './dto/create-quiz-answer.dto';
import { TFindAllSelectType } from './types';

/**
 * These are the base details needed for cheching the authorization for the user actions for a quiz submission
 */
type TDetailsForQuizSubmissionForStudent = {
  diffStart: number;
  diffEnd: number | null;
  diffLate: number | null;
  quizState: QuizState;
  quizStartsAt: Date;
  quizEndsAt: Date | null;
  quizLateSubmissionDate: Date | null;
  courseState: CourseState;
  courseId: number;
  attemptsAllowed: number | null;
} & FieldsOrNullFields<{
  enrollmentState: CourseEnrollmentState;
  enrollmentEndsAt: Date | null;
}> &
  FieldsOrNullFields<{
    quizSubmissionId: number;
    submissionGrade: number | null;
    submissionAttempts: number | null;
    submissionCreatedAt: Date;
    submissionSubmittedAt: Date | null;
  }>;

type TGetIdsReturn<T extends boolean | undefined | never = never> =
  T extends true ? { [k: number]: 1 | 0 } : number[];

@Injectable()
export class QuizSubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    courseId,
    quizId,
    studentId,
    Answers,
    grade,
    attempts,
  }: {
    quizId: QuizSubmission['quizId'];
    courseId: QuizSubmission['courseId'];
    studentId: QuizSubmission['studentId'];
    Answers?: CreateQuizSubmissionDto['Answers'];
    grade?: number;
    attempts?: number;
  }) {
    const data: Prisma.QuizSubmissionUncheckedCreateInput = {
      quizId: quizId,
      courseId: courseId,
      studentId: studentId,
      grade: typeof grade == 'number' ? grade : null,
      attempts: typeof attempts == 'number' ? attempts : null,
    };
    if (Answers) {
      data.submittedAt = new Date().toUTCString();
      data.Answers = {
        createMany: {
          data: Answers,
        },
      };
    }
    const quizSubmission = await this.prisma.quizSubmission.create({
      data: data,
    });

    return quizSubmission;
  }

  async findAll<SelectType extends TFindAllSelectType = 'custom'>(
    options = {} as {
      filters?: {
        courseId?: number;
        instructorId?: number;
        studetId?: number;
        quizId?: number;
      };
      selectType?: SelectType;
      // select?: {};
      // @todo Add pagination
    },
  ) {
    const where: Prisma.QuizSubmissionWhereInput = {};
    if (options.filters) {
      if (options.filters.courseId) {
        where.courseId = options.filters.courseId;
      }
      if (options.filters.quizId) {
        where.quizId = options.filters.quizId;
      }
      if (options.filters.instructorId) {
        where.Course = {
          ...((where.Course as any) || {}),
          Instructors: {
            ...(where.Course.Instructors || {}),
            some: {
              ...(where.Course.Instructors.some || {}),
              instructorId: options.filters.instructorId,
            },
          },
        };
      }
      if (options.filters.studetId) {
        where.studentId = options.filters.studetId;
      }
    }
    // if (options.selectType) {
    //   if (options.selectType == "student") {
    //     return this.prisma.quizSubmission.findMany({
    //       where: where,
    //       select: {
    //         quizId: true,
    //         attempts: true,
    //         courseId: true,
    //         createdAt: true,
    //         grade: true,
    //         quizSubmissionId: true,
    //         submittedAt: true,
    //       }
    //     });
    //   }
    // }
    return this.prisma.quizSubmission.findMany({
      where: where,
      select: {
        quizId: true,
        attempts: true,
        courseId: true,
        createdAt: true,
        grade: true,
        quizSubmissionId: true,
        submittedAt: true,
        studentId: true,
      },
    });
  }

  async findOne(id: number, includeAnswers?: boolean) {
    const include: Prisma.QuizSubmissionInclude = {};
    if (includeAnswers) {
      include.Answers = true;
    }
    return this.prisma.quizSubmission.findUnique({
      where: { quizSubmissionId: id },
      include: include,
    });
  }

  async update({
    answers,
    quizSubmissionId,
    studentId,
    grade,
    increaseAttempts,
  }: {
    quizSubmissionId: QuizQuestion['quizQuestionId'];
    answers: UpdateQuizSubmissionDto['Answers'];
    increaseAttempts?: boolean;
    grade?: number;
    studentId: QuizSubmission['studentId'];
  }) {
    // @todo You can update existing ones if they exist ?
    const result = await this.prisma.$transaction([
      this.prisma.quizAnswer.deleteMany({
        where: { submissionId: quizSubmissionId },
      }),
      this.prisma.quizAnswer.createMany({
        // where: { submissionId: id },
        data: answers.map((a) => ({
          ...a,
          submissionId: quizSubmissionId,
        })),
      }),
      this.prisma.quizSubmission.updateMany({
        where: { quizSubmissionId: quizSubmissionId },
        data: {
          submittedAt: new Date().toUTCString(),
          ...(increaseAttempts ? { attempts: { increment: 1 } } : {}),
          grade: grade || null,
          studentId: studentId,
        },
      }),
    ]);
    return result;
  }

  async remove(id: number) {
    return this.prisma.quizSubmission.deleteMany({
      where: { quizSubmissionId: id },
    });
  }

  async getTheQuestionsIds<T extends boolean | undefined | never = never>(
    quizId: Quiz['quizId'],
    useMap?: T,
  ): Promise<TGetIdsReturn<T>> {
    if (useMap === true) {
      // Chose 1 & 0 to be shorter in the jwt token
      const mappedValues = {} as { [k: number]: 1 | 0 };
      (
        await this.prisma.quizQuestion.findMany({
          where: { quizId: quizId },
          select: { quizQuestionId: true },
        })
      ).map((qq) => {
        mappedValues[qq.quizQuestionId] = 1;
        return qq.quizQuestionId;
      });
      return mappedValues as TGetIdsReturn<T>;
    }
    const values = (
      await this.prisma.quizQuestion.findMany({
        where: {
          quizId: quizId,
        },
        select: {
          quizQuestionId: true,
        },
      })
    ).map((qq) => qq.quizQuestionId);
    return values as TGetIdsReturn<T>;
  }
  async getAuthDetailsForStudent(userId: number, quizId: number) {
    /**
     * This is for better `prettier`
     */
    type T = TDetailsForQuizSubmissionForStudent;
    const result = await this.prisma.$queryRaw<T[]>`SELECT
    EXTRACT(EPOCH FROM q."startsAt" - NOW()) AS "diffStart",
    EXTRACT(EPOCH FROM q."endsAt" - NOW()) AS "diffEnd",
    EXTRACT(EPOCH FROM q."lateSubmissionDate" - NOW()) AS "diffLate",
    q."state" AS "quizState",
    q."startsAt" AS "quizStartsAt",
    q."endsAt" AS "quizEndsAt",
    q."lateSubmissionDate" AS "quizLateSubmissionDate",
    c."state" AS "courseState",
    c."courseId",
    c."attemptsAllowed",
    ce."state" AS "enrollmentState",
    ce."endsAt" AS "enrollmentEndsAt",
    qs."quizSubmissionId",
    qs."grade" AS "submissionGrade",
    qs."attempts" AS "submissionAttempts"
    qs."createdAt" AS "submissionCreatedAt"
    qs."submittedAt" AS "submissionSubmittedAt"
FROM
    "Quiz" AS q
INNER JOIN
    "Course" AS c
    ON
    (q."courseId" = c."courseId")
LEFT JOIN
    "CourseEnrollment" AS ce
    ON
    (ce."courseId" = c."courseId" AND ce."studentId" = ${userId})
LEFT JOIN
    "QuizSubmission" as qs
    ON
    (qs.quizId = q.quizId AND qs.studentId = ${userId})
WHERE
    q."quizId" = ${quizId};
`;
    return result;
  }

  async validateDetailsForStudent([
    row1,
  ]: TDetailsForQuizSubmissionForStudent[]) {
    if (!row1) {
      throw new NotFoundException(`This quiz doesn't exist`);
    }
    if (!row1.enrollmentState) {
      throw new ForbiddenException(`You are not enrolled in this course`);
    }
    if (row1.enrollmentState !== 'active') {
      throw new ForbiddenException(
        `Your enrollment in the course is not currently active`,
      );
    }
    if (row1.enrollmentEndsAt && row1.enrollmentEndsAt < new Date()) {
      throw new ForbiddenException(`Your enrollment in the course is expired`);
    }
    /**
     * @todo Update this when adding new states
     */
    if (row1.courseState !== 'available') {
      throw new BadRequestException(`This course is not currently available`);
    }

    if (row1.quizState !== 'available') {
      throw new BadRequestException(`This quiz is not currently available`);
    }

    return row1;
  }

  validateIDs(
    answers: CreateQuizAnswerDto[],
    IDsMap: {
      [k: number]: 0 | 1;
    },
  ) {
    for (const a of answers) {
      if (IDsMap[a.questionId] == 1) {
        IDsMap[a.questionId] = 0;
      } else if (IDsMap[a.questionId] == 0) {
        throw new BadRequestException(
          `Invalid field values "Answers" (Dubplicate questionId)`,
        );
      } else {
        throw new BadRequestException(
          `This question "${a.questionId}" doesn't exist in this quiz.`,
        );
      }
    }
  }
}
