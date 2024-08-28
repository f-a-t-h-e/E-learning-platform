import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, asc, desc, eq, gte, isNull, lte } from 'drizzle-orm';
import { DRIZZLE } from '../../common/providers-constants';
import { DrizzleService } from 'src/modules/drizzle/drizzle.service';
import { GetManyQuizzesQueryDto } from '../dto/queries/get-many-quizzes-query.dto';
import { TGetCreateAuthDetailsReturn, TGetManyQuizzesForStudent, TGetStudentAuth } from '../types';
import { BaseRepository } from '../../common/base.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { getManyQuizzesForStudentQuery, getStudentAuthQuery } from '../sql';

/**
 * The result of this is that drizzle was worse than prisma
 * 
 * when using db.query it took much more time than the prisma select/include
 * when using leftJoins for drizzle and raw sql for prisma, there is slightly better performance for raw sql as well
 * (means I don't need drizzle as I brought it for avoiding raw sql, but it seems it's technique is taking too much time than my own raw sql used with prisma)
 * 
 * I GOT NO SINGLE TEST "drizzle" WAS FASTER IN IT IN THIS FILE
 */
@Injectable()
export class QuizzesRepository extends BaseRepository {
  private selectAll: typeof this.database.tables.quiz._.columns &
    typeof this.database.tables.quizMetaData._.columns;
  constructor(
    @Inject(DRIZZLE) private readonly database: DrizzleService,
    private readonly prisma: PrismaService,
  ) {
    const methods = [
      'getInstructorAuthPerQuizQuery',
      'getInstructorAuthForCourseQuery',
      'getCreateAuthDetailsQuery',
      'getManyQuizzesForInstructorQuery',
      'getInstructorOneWithAuth',
      'getStudentAuthQuery',
      'getStudentAuthQueryp',
      'getStudentAuthPerQuizQuery',
      'getManyQuizzesForStudentQuery',
      'getManyQuizzesForStudentQueryp',
      'getStudentOneWithAuth',
      'getStudentOneWithAuthp',
    ];
    super(methods, QuizzesRepository);
    this.selectAll = {
      ...this.database.tables.quiz,
      ...this.database.tables.quizMetaData,
    } as unknown as typeof this.database.tables.quiz._.columns &
      typeof this.database.tables.quizMetaData._.columns;
  }

  // INSTRUCTOR QUERIES
  // AUTH
  async getInstructorAuthPerQuizQuery({
    quizId,
    userId,
  }: {
    userId: number;
    quizId: number;
  }) {
    const q = this.database.tables.quiz;
    const c = this.database.tables.course;
    const ci = this.database.tables.courseInstructor;

    const [data] = await this.database.db
      .select({
        quizId: q.quizId,
        courseId: c.courseId,
        instructorId: ci.instructorId,
        position: ci.position,
      })
      .from(q)
      .leftJoin(c, eq(q.courseId, c.courseId))
      .leftJoin(
        ci,
        and(eq(ci.courseId, c.courseId), eq(ci.instructorId, userId)),
      )
      .where(eq(q.quizId, quizId));

    return data;
  }

  async getInstructorAuthForCourseQuery({
    courseId,
    userId,
  }: {
    courseId: number;
    userId: number;
  }) {
    const c = this.database.tables.course;
    const ci = this.database.tables.courseInstructor;
    const [data] = await this.database.db
      .select({
        courseState: c.state,
        enrollmentState: ci.state,
        courseInstructorId: ci.courseInstructorId,
        position: ci.position,
        endsAt: ci.endsAt,
      })
      .from(c)
      .leftJoin(
        ci,
        and(eq(ci.courseId, c.courseId), eq(ci.instructorId, userId)),
      )
      .where(eq(c.courseId, courseId));

    return data;
  }

  async getCreateAuthDetailsQuery({
    courseId,
    userId,
    lessonId,
    unitId,
  }: {
    userId: number;
    courseId: number;
    unitId?: number;
    lessonId?: number;
  }) {
    const c = this.database.tables.course;
    const ci = this.database.tables.courseInstructor;
    const u = this.database.tables.unit;
    const l = this.database.tables.lesson;

    let query = this.database.db
      .select({
        courseId: c.courseId,
        courseState: c.state,
        position: ci.position,
        instructorState: ci.state,
        instructorEndsAt: ci.endsAt,
        ...(unitId ? { unitState: u.state } : {}),
        ...(lessonId
          ? {
              lessonState: l.state,
              unitId: l.unitId,
            }
          : {}),
      })
      .from(c)
      .leftJoin(
        ci,
        and(eq(ci.courseId, c.courseId), eq(ci.instructorId, userId)),
      )
      .$dynamic();
    if (unitId) {
      query
        .leftJoin(u, and(eq(u.courseId, c.courseId), eq(u.unitId, unitId)))
        .$dynamic();
    }
    if (lessonId) {
      query
        .leftJoin(l, and(eq(l.courseId, c.courseId), eq(l.lessonId, lessonId)))
        .$dynamic();
    }
    const [data] = await query.where(eq(c.courseId, courseId));
    return data as TGetCreateAuthDetailsReturn;
  }

  async getManyQuizzesForInstructorQuery(query: GetManyQuizzesQueryDto) {
    const q = this.database.tables.quiz;
    const qmd = this.database.tables.quizMetaData;

    const condition = and(
      eq(q.courseId, query.courseId),
      query.quizSkip
        ? query.quizSkip < 0
          ? lte(q.order, query.quizSkip)
          : gte(q.order, query.quizSkip)
        : undefined,
      query.lessonId
        ? eq(q.lessonId, query.lessonId)
        : query.unitId
          ? and(eq(q.unitId, query.unitId), isNull(q.lessonId))
          : and(isNull(q.unitId), isNull(q.lessonId)),
    );
    const data = await this.database.db
      .select(this.selectAll)
      .from(q)
      .leftJoin(qmd, eq(qmd.quizId, q.quizId))
      .limit((query.quizPageSize || 10) + 1)
      .offset(
        Math.abs(query.quizSkip) || 0 + +(typeof query.quizCursor == 'number'),
      )
      .orderBy(query.quizSkip < 0 ? desc(q.order) : asc(q.order))
      .where(condition);

    return data;
  }

  async getInstructorOneWithAuth({
    quizId,
    userId,
  }: {
    userId: number;
    quizId: number;
  }) {
    const data = await this.database.db.query.quiz.findFirst({
      where: (fields, { eq }) => eq(fields.quizId, quizId),
      with: {
        course: {
          with: {
            courseInstructors: {
              where: (fields, { eq }) => eq(fields.instructorId, userId),
              columns: {
                state: true,
                endsAt: true,
                position: true,
              },
            },
          },
          columns: {
            state: true,
          },
        },
        quizQuestions: {
          with: {
            quizQuestionOptions: true,
          },
        },
        quizMetaData: true,
      },
    });
    return data;
  }

  // STUDENT QUERIES
  // AUTH
  // I believe part of this (first) is for creating a connection or something
  // first +28ms then ~ +3ms
  async getStudentAuthQuery({
    courseId,
    userId,
  }: {
    userId: number;
    courseId: number;
  }) {
    const [data] = await this.database.db
      .select({
        courseState: this.database.tables.course.state,
        enrollmentState: this.database.tables.courseEnrollment.state,
        courseEnrollmentId:
          this.database.tables.courseEnrollment.courseEnrollmentId,
        endsAt: this.database.tables.courseEnrollment.endsAt,
      })
      .from(this.database.tables.course)
      .leftJoin(
        this.database.tables.courseEnrollment,
        and(
          eq(
            this.database.tables.courseEnrollment.courseId,
            this.database.tables.course.courseId,
          ),
          eq(this.database.tables.courseEnrollment.studentId, userId),
        ),
      )
      .where(eq(this.database.tables.course.courseId, courseId));

    return data;
  }
  // first +8ms then +2ms
  async getStudentAuthQueryp({
    courseId,
    userId,
  }: {
    userId: number;
    courseId: number;
  }) {
    const [query, params] = getStudentAuthQuery({courseId,userId})
    const [data] = await this.prisma.$queryRawUnsafe<TGetStudentAuth[]>(query, ...params);

    return data;
  }

  async getStudentAuthPerQuizQuery({
    quizId,
    userId,
  }: {
    userId: number;
    quizId: number;
  }) {
    const [data] = await this.database.db
      .select({
        quizState: this.database.tables.quiz.state,
        courseState: this.database.tables.course.state,
        enrollmentState: this.database.tables.courseEnrollment.state,
        courseEnrollmentId:
          this.database.tables.courseEnrollment.courseEnrollmentId,
        endsAt: this.database.tables.courseEnrollment.endsAt,
      })
      .from(this.database.tables.quiz)
      .leftJoin(
        this.database.tables.course,
        eq(
          this.database.tables.course.courseId,
          this.database.tables.quiz.courseId,
        ),
      )
      .leftJoin(
        this.database.tables.courseEnrollment,
        and(
          eq(
            this.database.tables.courseEnrollment.courseId,
            this.database.tables.quiz.courseId,
          ),
          eq(this.database.tables.courseEnrollment.studentId, userId),
        ),
      )
      .where(eq(this.database.tables.quiz.quizId, quizId));

    return data;
  }

  // first +7ms then ~ +3ms
  async getManyQuizzesForStudentQuery(query: GetManyQuizzesQueryDto) {
    const q = this.database.tables.quiz;
    const qmd = this.database.tables.quizMetaData;

    const condition = and(
      eq(q.courseId, query.courseId),
      query.quizSkip
        ? query.quizSkip < 0
          ? lte(q.order, query.quizSkip)
          : gte(q.order, query.quizSkip)
        : undefined,
      query.lessonId
        ? eq(q.lessonId, query.lessonId)
        : query.unitId
          ? and(eq(q.unitId, query.unitId), isNull(q.lessonId))
          : and(isNull(q.unitId), isNull(q.lessonId)),
    );

    const data = await this.database.db
      .select({
        quizId: q.quizId,
        courseId: q.courseId,
        unitId: q.unitId,
        lessonId: q.lessonId,
        order: q.order,
        state: q.state,
        title: q.title,
        startsAt: qmd.startsAt,
        endsAt: qmd.endsAt,
        lateSubmissionDate: qmd.lateSubmissionDate,
        attemptsAllowed: qmd.attemptsAllowed,
        fullGrade: qmd.fullGrade,
        type: qmd.type,
      })
      .from(q)
      .leftJoin(qmd, eq(qmd.quizId, q.quizId))
      .limit((query.quizPageSize || 10) + 1)
      .offset(
        Math.abs(query.quizSkip) || 0 + +(typeof query.quizCursor == 'number'),
      )
      .orderBy(query.quizSkip < 0 ? desc(q.order) : asc(q.order))
      .where(condition);
    return data;
  }
  // first +5ms then +2ms
  async getManyQuizzesForStudentQueryp(query: GetManyQuizzesQueryDto) {
    const [q, p] = getManyQuizzesForStudentQuery(query)
    const data = await this.prisma.$queryRawUnsafe<TGetManyQuizzesForStudent[]>(q, ...p);
    return data;
  }

  // it alternates between +48ms and (+7ms / +6ms) (it hits +48ms more than prisma' hits +17ms and it requires requesting another query )
  // ((+7ms / +6ms) seems to be the cached one but it lasts for very short time not like prisma)
  // first (+48ms, +9ms) then (+7ms / +6ms) (for short time only)
  async getStudentOneWithAuth({
    quizId,
    userId,
  }: {
    userId: number;
    quizId: number;
  }) {
    const data = await this.database.db.query.quiz.findFirst({
      where: (fields, { eq }) => eq(fields.quizId, quizId),
      with: {
        course: {
          with: {
            courseEnrollments: {
              where: (fields, { eq }) => eq(fields.studentId, userId),
              columns: {
                state: true,
                endsAt: true,
              },
            },
          },
          columns: {
            state: true,
          },
        },
        quizQuestions: {
          with: {
            quizQuestionOptions: true,
          },
        },
        quizSubmissions: {
          where: (fields, { eq }) => eq(fields.studentId, userId),
          columns: {
            submittedAt: true,
            attempts: true,
            grade: true,
            reviewedAt: true,
            quizId: true,
            createdAt: true,
          },
        },
        quizMetaData: {
          columns: {
            attemptsAllowed: true,
            endsAt: true,
            fullGrade: true,
            lateSubmissionDate: true,
            passGrade: true,
            startsAt: true,
            type: true,
          },
        },
      },
    });
    return data;
  }
  // first (+17ms) then +7ms (for long time with 5 select queries)
  async getStudentOneWithAuthp({
    quizId,
    userId,
  }: {
    userId: number;
    quizId: number;
  }) {
    const data = await this.prisma.quiz.findFirst({
      where: { quizId: quizId },
      include: {
        Course: {
          select: {
            state: true,
            Students: {
              where: {
                studentId: userId,
              },
              select: {
                state: true,
                endsAt: true,
              },
            },
          },
        },
        Questions: {
          include: {
            Options: true,
          },
        },
        QuizSubmissions: {
          where: { studentId: userId },
          select: {
            submittedAt: true,
            attempts: true,
            grade: true,
            reviewedAt: true,
            quizId: true,
            createdAt: true,
          },
        },
        QuizMetaData: {
          select: {
            attemptsAllowed: true,
            endsAt: true,
            fullGrade: true,
            lateSubmissionDate: true,
            passGrade: true,
            startsAt: true,
            type: true,
          },
        },
      },
    });
    return data;
  }
}
