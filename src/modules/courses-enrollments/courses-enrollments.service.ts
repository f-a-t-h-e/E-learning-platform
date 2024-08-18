import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCourseEnrollmentDto } from './dto/create-course-enrollment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateManyCourseEnrollments } from './dto/create-many-course-enrollments.dto';

const SELECT_ENROLLED_STUDENTS: { [k in keyof Partial<User>]: boolean } = {
  id: true,
  name: true,
};

@Injectable()
export class CoursesEnrollmentsService {
  constructor(private prisma: PrismaService) {}
  async create(
    createCoursesEnrollmentDto: CreateCourseEnrollmentDto,
    studentId: number,
  ) {
    const courseEnrollment = await this.prisma.courseEnrollment.create({
      data: {
        courseId: createCoursesEnrollmentDto.courseId,
        studentId: studentId,
      },
    });
    return courseEnrollment;
  }

  async createMany(
    createManyCourseEnrollments: CreateManyCourseEnrollments,
    // authorization field
    instructorId: number,
  ) {
    const result = await this.prisma.useTransaction(async (tx) => {
      // You can select the instructor with the instructorId to check if it's 404 or 403/401
      const course = await tx.course.findFirst({
        where: {
          Instructors: {
            some: {
              instructorId: instructorId,
            },
          },
          id: createManyCourseEnrollments.courseId,
        },
        select: {
          Students: {
            where: {
              studentId: {
                in: createManyCourseEnrollments.studentIds,
              },
            },
            select: {
              studentId: true,
            },
          },
        },
      });
      if (!course) {
        // You don't have such course
        throw new ForbiddenException(`You are not a teacher in this course!`);
      }

      const inputs: {
        studentId: number;
        courseId: number;
      }[] = [];
      let addId = false;
      for (const newId of createManyCourseEnrollments.studentIds) {
        addId = true;
        for (let i = 0; i < course.Students.length; i++) {
          if (course.Students[i].studentId === newId) {
            i = course.Students.length;
            addId = false;
          }
        }
        if (addId) {
          inputs.push({
            studentId: newId,
            courseId: createManyCourseEnrollments.courseId,
          });
        }
      }
      if (!inputs.length) {
        return {
          inserted: 0,
        };
      }
      const r = await tx.courseEnrollment.createMany({
        data: inputs,
      });
      return {
        inserted: r.count,
      };
    });

    return result;
  }

  async findAllStudentsInCourse(courseId: number, instructorId: number) {
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        Instructors: {
          some: {
            instructorId: instructorId,
          },
        },
      },
      select: {
        Students: {
          select: {
            Student: {
              select: SELECT_ENROLLED_STUDENTS,
            },
          },
        },
      },
    });
    // const students = await this.prisma.user.findMany({
    //   where: {
    //     roleName: 'student',
    //     CoursesEnrollment: {
    //       some: {
    //         courseId: courseId,
    //         // You can do this for one select query + authorization
    //         Course: {
    //           CourseInstructors: {
    //             some: {
    //               instructorId: instructorId,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   select: SELECT_ENROLLED_STUDENTS,
    // });
    if (!course) {
      throw new ForbiddenException(
        `You have no access to this course or it doesn't exist`,
      );
    }
    return course.Students.map((enrollment) => enrollment.Student);
  }

  async removeMany(
    studentsIds: number[],
    courseId: number,
    instructorId: number,
  ) {
    const deletedCourseEnrollment =
      await this.prisma.courseEnrollment.deleteMany({
        where: {
          studentId: {
            in: studentsIds,
          },
          courseId: courseId,
          Course: {
            Instructors: {
              some: {
                instructorId: instructorId,
              },
            },
          },
        },
      });
    return deletedCourseEnrollment.count;
  }
}
