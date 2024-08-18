import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assume PrismaService is properly set up
import { CreateQuizSubmissionDto } from './dto/create-quiz-submission.dto';
import { UpdateQuizSubmissionDto } from './dto/update-quiz-submission.dto';

@Injectable()
export class QuizSubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuizSubmissionDto: CreateQuizSubmissionDto) {
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
      },
    });

    return quizSubmission;
  }

  async findAll(courseId: number) {
    return this.prisma.quizSubmission.findMany({
      where: { Quiz: { courseId: courseId } },
    });
  }

  async findOne(id: number) {
    return this.prisma.quizSubmission.findUnique({
      where: { id },
      include: { Answers: true },
    });
  }

  async update(id: number, updateQuizSubmissionDto: UpdateQuizSubmissionDto) {
    const { Answers, ...quizSubmissionData } = updateQuizSubmissionDto;

    const quizSubmission = await this.prisma.quizSubmission.update({
      where: { id },
      data: {
        ...quizSubmissionData,
        Answers: {
          deleteMany: {}, // This will delete existing answers before updating
          create: Answers,
        },
      },
    });

    return quizSubmission;
  }

  async remove(id: number) {
    return this.prisma.quizSubmission.delete({
      where: { id },
    });
  }
}
