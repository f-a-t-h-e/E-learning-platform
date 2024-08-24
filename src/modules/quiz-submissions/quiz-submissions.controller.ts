import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
  BadRequestException,
  Req,
  Put,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { QuizSubmissionsService } from './quiz-submissions.service';
import { CreateQuizSubmissionDto } from './dto/create-quiz-submission.dto';
import { UpdateQuizSubmissionDto } from './dto/update-quiz-submission.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { RequestUser } from '../auth/entities/request-user.entity';
import { CoursesService } from '../courses/courses.service';
import {
  TIME_DIFF_BETWEEN_NOW_AND_END_DATE_FOR_SUBMISSION,
  TIME_GAP_FOR_SUBMISSION,
  TIME_TO_GET_TOKEN_BEFORE_START_IN_SECONDS,
} from 'src/config/time-periods.config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  QUIZ_SUBMISSION_TOKEN_NAME,
  QUIZ_SUBMISSION_TOKEN_SECRET,
} from 'src/config/cookies.config';
import { TQuizSubmissionTokenPayloud } from './types';

@ApiBearerAuth()
@ApiErrorResponses()
@ApiTags('Quiz Submissions')
@Controller('quiz-submissions')
export class QuizSubmissionsController {
  constructor(
    private readonly quizSubmissionsService: QuizSubmissionsService,
    private readonly coursesService: CoursesService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @RolesDecorator(Role.Student)
  @ApiOperation({ summary: 'Create a new quiz submission' })
  @ApiResponse({
    status: 201,
    description: 'Quiz submission successfully created.',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: Request,
    @Body() createQuizSubmissionDto: CreateQuizSubmissionDto,
    @User() user: RequestUser,
  ) {
    const details = await this.quizSubmissionsService.getAuthDetailsForStudent(
      user.userId,
      createQuizSubmissionDto.quizId,
    );
    const row1 =
      await this.quizSubmissionsService.validateDetailsForStudent(details);
    const activeAttempt = details.find((d) => d.submissionSubmittedAt !== null);
    if (
      typeof row1.diffEnd == 'number' &&
      row1.diffEnd < TIME_DIFF_BETWEEN_NOW_AND_END_DATE_FOR_SUBMISSION
    ) {
      throw new BadRequestException(`This quiz ended`);
    }
    if (row1.diffStart > TIME_TO_GET_TOKEN_BEFORE_START_IN_SECONDS) {
      throw new BadRequestException(
        `This quiz hasn't started yet and it's still too early to request a token for it`,
      );
    }
    const tokenLifeInSeconds = row1.quizLateSubmissionDate
      ? row1.diffLate
      : row1.diffEnd
        ? row1.diffEnd + TIME_GAP_FOR_SUBMISSION
        : null;

    if (row1.attemptsAllowed) {
      if (details.length - +!!activeAttempt >= row1.attemptsAllowed) {
        throw new BadRequestException(`Too many attempts`);
      }
      // @todo Get the submission that you have submitted earlier to use it to increase it's attempts instead of creating a new one
    }
    // Use token
    if (typeof tokenLifeInSeconds == 'number') {
      const IDsMap = await this.quizSubmissionsService.getTheQuestionsIds(
        createQuizSubmissionDto.quizId,
        true,
      );
      const attempt = activeAttempt
        ? undefined
        : await this.quizSubmissionsService.create({
            courseId: row1.courseId,
            quizId: createQuizSubmissionDto.quizId,
            studentId: user.userId,
            grade: null,
            attempts:
              typeof activeAttempt.attemptsAllowed !== 'number' ? 0 : null,
          });
      const submissionToken = await this.jwtService.signAsync(
        {
          quizId: createQuizSubmissionDto.quizId,
          studentId: user.userId,
          questions: IDsMap,
          quizSubmissionId: (activeAttempt && attempt).quizSubmissionId,
          increaseAttempts: typeof activeAttempt.attemptsAllowed !== 'number',
        } as TQuizSubmissionTokenPayloud,
        {
          subject: QUIZ_SUBMISSION_TOKEN_NAME,
          secret: QUIZ_SUBMISSION_TOKEN_SECRET,
          expiresIn: tokenLifeInSeconds,
        },
      );
      req.res.cookie(QUIZ_SUBMISSION_TOKEN_NAME, submissionToken, {
        secure: true,
        httpOnly: true,
        maxAge: tokenLifeInSeconds * 1000,
        sameSite: 'strict',
      });

      return {
        action: 'get-token',
        startsAt: row1.quizStartsAt,
        endsAt: row1.quizEndsAt,
        quizSubmissionId: (activeAttempt && attempt).quizSubmissionId,
        token: submissionToken,
      };
    }
    if (activeAttempt) {
      // Use the attempt
      // @todo Check if you will really have such flow, as why to get a token if you have no endDate for the quiz ?
      const IDsMap = await this.quizSubmissionsService.getTheQuestionsIds(
        createQuizSubmissionDto.quizId,
        true,
      );
      if (!createQuizSubmissionDto.Answers) {
        throw new BadRequestException(
          `This field "Answers" is required for this quiz`,
        );
      }
      this.quizSubmissionsService.validateIDs(
        createQuizSubmissionDto.Answers,
        IDsMap,
      );

      await this.quizSubmissionsService.update({
        answers: createQuizSubmissionDto.Answers,
        quizSubmissionId: activeAttempt.quizSubmissionId,
        studentId: user.userId,
        // @todo Check if you can calculate it now or it should be calculated later
        grade: null,
        // if it's not a number, means you can re-submit infinitly, so you can just increase the attempts
        // this should be false, as if you have an `activeAttempt`, it means you inserted it once you created it ?
        increaseAttempts: typeof activeAttempt.attemptsAllowed !== 'number',
      });
      return {
        action: 'submitted-old',
        quizSubmissionId: activeAttempt.quizSubmissionId,
      };
    }
    const attempt = await this.quizSubmissionsService.create({
      courseId: row1.courseId,
      quizId: createQuizSubmissionDto.quizId,
      studentId: user.userId,
      Answers: createQuizSubmissionDto.Answers,
      // @todo Check if you can calculate it now or it should be calculated later
      grade: null,
      attempts: typeof activeAttempt.attemptsAllowed === 'number' ? 1 : null,
    });
    return {
      action: 'submitted-new',
      quizSubmissionId: attempt.quizSubmissionId,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Submit the quiz submission that you have' })
  @ApiParam({
    name: 'id',
    description: '`quizSubmissionId` of the quiz submission to submit',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Quiz submission successfully submitted.',
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizSubmissionDto: UpdateQuizSubmissionDto,
    @Req() req: Request,
  ) {
    let payload: TQuizSubmissionTokenPayloud;
    try {
      const token = req.cookies[QUIZ_SUBMISSION_TOKEN_NAME];
      if (!token) {
        throw new UnauthorizedException();
      }
      payload = await this.jwtService.verifyAsync<TQuizSubmissionTokenPayloud>(
        token,
        {
          secret: QUIZ_SUBMISSION_TOKEN_SECRET,
          subject: QUIZ_SUBMISSION_TOKEN_NAME,
        },
      );
    } catch (error) {
      throw new UnauthorizedException();
    }
    if (payload.quizSubmissionId != id) {
      throw new ForbiddenException(`Your token is not for this submission`);
    }
    this.quizSubmissionsService.validateIDs(
      updateQuizSubmissionDto.Answers,
      payload.questions,
    );

    return this.quizSubmissionsService.update({
      quizSubmissionId: id,
      studentId: payload.studentId,
      answers: updateQuizSubmissionDto.Answers,
      // @todo Check if you can calculate it now or it should be calculated later
      grade: null,
      increaseAttempts: payload.increaseAttempts,
    });
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Retrieve all quiz submissions' })
  @ApiQuery({
    name: 'courseId',
    type: Number,
    description: `\`course.id\` that you want to get its submissions.`,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quiz submissions.',
  })
  findAll(
    @Query('courseId', ParseIntPipe) courseId: number,
    @User() user: RequestUser,
  ) {
    if (user.roleName == 'student') {
      return this.quizSubmissionsService.findAll({
        filters: {
          courseId: courseId,
          studetId: user.userId,
        },
      });
    }
    return this.quizSubmissionsService.findAll({
      filters: {
        courseId: courseId,
        instructorId: user.userId,
      },
    });
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Retrieve a specific quiz submission by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the quiz submission to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the quiz submission.',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: RequestUser,
  ) {
    const submission = await this.quizSubmissionsService.findOne(id, true);
    if (submission.studentId !== user.userId) {
      if (user.roleName !== 'teacher') {
        throw new ForbiddenException(
          `You can't access this submission as it's not yours nor you are an instructor in this course`,
        );
      }
      await this.coursesService.authHard({
        courseId: submission.courseId,
        userId: user.userId,
      });
    }
    return submission;
  }

  // @Delete(':id')
  // @RolesDecorator(Role.Student)
  // @ApiOperation({ summary: 'Delete a specific quiz submission by ID' })
  // @ApiParam({
  //   name: 'id',
  //   description: 'The ID of the quiz submission to delete',
  //   type: Number,
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Quiz submission successfully deleted.',
  // })
  // async remove(
  //   @Param('id', ParseIntPipe) id: number,
  //   @User() user: RequestUser,
  // ) {
  //   const target = await this.quizSubmissionsService.findOne(id);
  //   if (target.studentId !== user.userId) {
  //     throw new ForbiddenException(`You don't own this submission`);
  //   }
  //   return this.quizSubmissionsService.remove(id);
  // }
}
