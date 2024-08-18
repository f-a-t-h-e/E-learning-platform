import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';

@Injectable()
export class QuizQuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuizQuestionDto: CreateQuizQuestionDto) {
    const { Options, ...quizQuestionData } = createQuizQuestionDto;

    return this.prisma.quizQuestion.create({
      data: {
        ...quizQuestionData,
        Options: {
          create: Options?.map((option) => ({
            ...option,
          })),
        },
      },
      include: {
        Options: true,
      },
    });
  }

  async createMany(createQuizQuestionsDto: CreateQuizQuestionDto[]) {
    return this.prisma.quizQuestion.createMany({
      data: createQuizQuestionsDto,
    });
  }

  async findAll(courseId: number) {
    return this.prisma.quizQuestion.findMany({
      where: {
        Quiz: {
          courseId: courseId,
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.quizQuestion.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateQuizQuestionDto: UpdateQuizQuestionDto) {
    const { Options, ...quizQuestionData } = updateQuizQuestionDto;

    return this.prisma.quizQuestion.update({
      where: { id },
      data: {
        ...quizQuestionData,
        Options: {
          upsert: Options?.map((option) => ({
            where: {
              id_questionId: { id: option.id, questionId: option.questionId },
            },
            update: {
              ...option,
            },
            create: {
              ...option,
            },
          })),
        },
      },
      include: {
        Options: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.quizQuestion.delete({
      where: { id },
    });
  }

  async removeMany(id: number) {
    return this.prisma.quizQuestion.deleteMany({
      where: {
        quizId: id,
      },
    });
  }

  async findByQuizId(quizId: number) {
    return this.prisma.quizQuestion.findMany({
      where: { quizId },
    });
  }

  async countQuestionsByQuizId(quizId: number) {
    return this.prisma.quizQuestion.count({
      where: { quizId },
    });
  }
}
