import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assume PrismaService is properly set up
import { CreateQuizSubmissionDto } from './dto/create-quiz-submission.dto';
import { UpdateQuizSubmissionDto } from './dto/update-quiz-submission.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuizSubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createQuizSubmissionDto: CreateQuizSubmissionDto,
    courseId: number,
  ) {
    const { Answers, ...quizSubmissionData } = createQuizSubmissionDto;

    const quizSubmission = await this.prisma.quizSubmission.create({
      data: {
        ...quizSubmissionData,
        Answers: {
          createMany: {
            data: Answers,
            skipDuplicates: true,
          },
        },
        courseId: courseId,
      },
    });

    return quizSubmission;
  }

  async findAll(courseId: number) {
    return this.prisma.quizSubmission.findMany({
      where: { Quiz: { courseId: courseId } },
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

  async update(id: number, updateQuizSubmissionDto: UpdateQuizSubmissionDto) {
    const { Answers, ...quizSubmissionData } = updateQuizSubmissionDto;
    const result = await this.prisma.$transaction([
      this.prisma.quizAnswer.deleteMany({
        where: { submissionId: id },
      }),
      this.prisma.quizAnswer.updateMany({
        where: { submissionId: id },
        data: Answers,
      }),
      this.prisma.quizSubmission.updateMany({
        where: { quizSubmissionId: id },
        data: {
          ...quizSubmissionData,
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

  async isUserEnrolledInQuizCourse(userId: number, quizeId: number) {
    const quize = await this.prisma.quiz.findFirst({
      where: { quizId: quizeId },
      select: {
        Course: {
          select: {
            Students: {
              where: { studentId: userId },
              select: {
                state: true,
              },
            },
            courseId: true,
          },
        },
      },
    });
    if (!quize) {
      throw new NotFoundException(`This quize doesn't exist`);
    }
    if (!quize.Course.Students[0]) {
      throw new ForbiddenException(`This user is not enrolled in this course`);
    }

    if (quize.Course.Students[0].state !== 'ACTIVE') {
      throw new ForbiddenException(`Your enrollment state is invalid`);
    }

    return quize.Course.courseId;
  }
}
