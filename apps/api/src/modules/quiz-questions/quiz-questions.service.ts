import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'common/prisma/prisma.service';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';
import { QuizQuestionRepository } from './repositories/quiz-questions.repository';

@Injectable()
export class QuizQuestionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: QuizQuestionRepository,
  ) {}

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

  async findOneForStudent(questionId: number, studentId: number) {
    const data = await this.repo.getQuestionsDetailsForStudentWithAuth({
      questionId: questionId,
      studentId: studentId,
      includeCorrectAnswer: true,
      includeOptions: true,
      includeStudentAnswer: true,
    });
    if (!data) {
      return {
        found: false as const,
      };
    }
    const {
      order,
      questionType,
      fullGrade,
      passGrade,
      questionText,
      correctAnswer,
      Options,
      //
      answerGrade,
      chosenOptionId,
      quizAnswerId,
      studentAnswer,
    } = data;
    return {
      found: true as const,
      question: {
        order,
        questionType,
        fullGrade,
        passGrade,
        questionText,
        correctAnswer,
        Options,
      },
      studentAnswer: {
        answer: studentAnswer,
        quizAnswerId: quizAnswerId,
        grade: answerGrade,
        chosenOptionId: chosenOptionId,
      },
      data,
    };
  }

  validateFindOneForStudent(
    data: Awaited<
      ReturnType<typeof this.repo.getQuestionsDetailsForStudentWithAuth>
    >,
  ) {
    if (!data.enrollmentState) {
      throw new ForbiddenException(
        `You are not enrolled in this question' course.`,
      );
    }
    if (data.enrollmentState !== 'active') {
      throw new ForbiddenException(`Your enrollment state is not active`);
    }
    if (data.quizEndsAt && data.quizStartsAt < new Date()) {
      throw new BadRequestException(
        `The quiz of this question is not open yet`,
      );
    }
  }

  async update(id: number, updateQuizQuestionDto: UpdateQuizQuestionDto) {
    const { Options, ...quizQuestionData } = updateQuizQuestionDto;

    return this.prisma.quizQuestion.update({
      where: { quizQuestionId: id },
      data: {
        ...quizQuestionData,
        Options: {
          upsert: Options?.map((option) => ({
            where: {
              quizeQuestionOptionId: option.quizeQuestionOptionId,
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
      where: { quizQuestionId: id },
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
