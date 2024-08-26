import { Inject, Injectable } from '@nestjs/common';
import { and, asc, desc, eq, gte, isNull, lte } from 'drizzle-orm';
import { DRIZZLE } from 'src/common/providers-constants';
import { DrizzleService } from 'src/modules/drizzle/drizzle.service';
import { GetManyQuizzesQueryDto } from '../dto/queries/get-many-quizzes-query.dto';
import { TGetCreateAuthDetailsReturn } from '../types';

@Injectable()
export class QuizzesRepository {
  constructor(@Inject(DRIZZLE) private readonly database: DrizzleService) {}

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
      .select({
        ...q._.columns,
        ...qmd._.columns,
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
}
