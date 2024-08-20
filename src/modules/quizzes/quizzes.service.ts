import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    const { Questions, ...quizData } = createQuizDto;

    return this.prisma.quiz.create({
      data: {
        ...quizData,
        Questions: {
          create: Questions?.map((question) => ({
            ...question,
            Options: {
              create: question.Options?.map((option) => ({
                ...option,
              })),
            },
          })),
        },
      },
      include: {
        Questions: {
          include: {
            Options: true, // Include options if needed
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.quiz.findMany();
  }

  async findOne(id: number) {
    return this.prisma.quiz.findUnique({
      where: { quizId: id },
      include: {
        Questions: {
          include: {
            Options: true,
          },
        },
      },
    });
  }

  async update(id: number, updateQuizDto: UpdateQuizDto, instructorId: number) {
    // Check if the instructor is associated with the course
    const quiz = await this.prisma.quiz.findUnique({
      where: {
        quizId: id,
        Course: {
          Instructors: {
            some: {
              instructorId: instructorId,
            },
          },
        },
      },
      select: {
        startsAt: true,
        Questions: {
          select: {
            quizQuestionId: true,
            Options: {
              select: {
                quizeQuestionOptionId: true,
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new ForbiddenException(
        `You do not have permission to update this quiz.`,
      );
    }

    return this.prisma.quiz.update({
      where: { quizId: id },
      data: {
        ...updateQuizDto,
        Questions: {
          upsert: updateQuizDto.Questions?.map((question) => ({
            where: { quizQuestionId: question.quizQuestionId, quizId: id },
            update: {
              ...question,
              id: undefined,
              Options: {
                upsert: question.Options?.map((option) => ({
                  where: {
                    quizeQuestionOptionId_questionId: {
                      quizeQuestionOptionId: option.quizeQuestionOptionId,
                      questionId: option.questionId,
                    },
                  },
                  update: { ...option, questionId: undefined },
                  create: { ...option, questionId: undefined },
                })),
              },
            },
            create: {
              ...question,
              id: undefined,
              Options: {
                create: question.Options?.map((option) => ({
                  ...option,
                  questionId: undefined,
                })),
              },
            },
          })),
        },
      },
      include: {
        Questions: {
          include: {
            Options: true,
          },
        },
      },
    });
  }
  async remove(id: number) {
    return this.prisma.quiz.delete({
      where: { quizId: id },
    });
  }

  async findByCourseId(courseId: number) {
    return this.prisma.quiz.findMany({
      where: { courseId },
    });
  }

  async findByLessonId(lessonId: number) {
    return this.prisma.quiz.findMany({
      where: { lessonId },
    });
  }

  async findQuizzesByDateRange(start: Date, end: Date) {
    return this.prisma.quiz.findMany({
      where: {
        startsAt: { gte: start },
        endsAt: { lte: end },
      },
    });
  }
}
