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
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { RolesDecorator } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from '../../common/decorators/user.decorator';
import { RequestUser } from '../auth/entities/request-user.entity';
import { CoursesService } from '../courses/courses.service';
import {
  TIME_DIFF_BETWEEN_NOW_AND_END_DATE_FOR_SUBMISSION,
  TIME_GAP_FOR_SUBMISSION,
  TIME_TO_GET_TOKEN_BEFORE_START_IN_SECONDS,
} from '../../config/time-periods.config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  QUIZ_SUBMISSION_TOKEN_NAME,
  QUIZ_SUBMISSION_TOKEN_SECRET,
} from '../../config/cookies.config';
import { TQuizSubmissionTokenPayloud } from './types';
import { TaskSchedulerService } from '../task-scheduler/task-scheduler.service';
import { Channels_Enum } from 'common/enums/channels.enum';

@ApiBearerAuth()
@ApiErrorResponses()
@ApiTags('Quiz Submissions')
@Controller('quiz-submissions')
export class QuizSubmissionsController {
  constructor(
    private readonly quizSubmissionsService: QuizSubmissionsService,
    private readonly coursesService: CoursesService,
    private readonly jwtService: JwtService,
    private readonly taskSchedulerService: TaskSchedulerService,
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
    const activeAttempt = details.find(
      (d) => d.quizSubmissionId && d.submissionSubmittedAt == null,
    );

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
      ? Math.round(+row1.diffLate)
      : row1.diffEnd
        ? Math.round(+row1.diffEnd) + TIME_GAP_FOR_SUBMISSION
        : null;

    if (row1.attemptsAllowed) {
      if (
        details.filter((d) => !!d.quizSubmissionId && !!d.submissionSubmittedAt)
          .length >= row1.attemptsAllowed
      ) {
        throw new BadRequestException(`Too many attempts`);
      }
      // @todo Get the submission that you have submitted earlier to use it to increase it's attempts instead of creating a new one
    }
    const IDsMap = await this.quizSubmissionsService.getTheQuestionsIds(
      createQuizSubmissionDto.quizId,
      true,
    );
    // Use token
    if (typeof tokenLifeInSeconds == 'number') {
      const attempt = activeAttempt
        ? activeAttempt
        : await this.quizSubmissionsService.create({
            courseId: row1.courseId,
            quizId: createQuizSubmissionDto.quizId,
            studentId: user.userId,
            grade: null,
            attempts: typeof row1.attemptsAllowed !== 'number' ? 0 : null,
          });
      const submissionToken = await this.jwtService.signAsync(
        {
          quizId: createQuizSubmissionDto.quizId,
          studentId: user.userId,
          questions: IDsMap,
          quizSubmissionId: attempt.quizSubmissionId,
          increaseAttempts: typeof row1.attemptsAllowed !== 'number',
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
      this.taskSchedulerService.scheduleUniqueEvent({
        event: {
          channel: Channels_Enum.review_quiz,
          data: createQuizSubmissionDto.quizId,
        },
        taskId: `${Channels_Enum.review_quiz}:${createQuizSubmissionDto.quizId}`,
        triggerTime: (row1.quizLateSubmissionDate || row1.quizEndsAt) as Date,
      });
      return {
        action: 'get-token',
        startsAt: row1.quizStartsAt,
        endsAt: row1.quizEndsAt,
        quizSubmissionId: attempt.quizSubmissionId,
        token: submissionToken,
      };
    }

    // If it's a quiz with no specific time
    if (!createQuizSubmissionDto.Answers) {
      throw new BadRequestException(
        `This field "Answers" is required for this quiz`,
      );
    }
    this.quizSubmissionsService.validateIDs(
      createQuizSubmissionDto.Answers,
      IDsMap,
    );
    if (activeAttempt) {
      // Use the attempt
      // @todo Check if you will really have such flow, as why to get a token if you have no endDate for the quiz ?
      await this.quizSubmissionsService.update({
        answers: createQuizSubmissionDto.Answers,
        quizSubmissionId: activeAttempt.quizSubmissionId,
        studentId: user.userId,
        // @todo Check if you can calculate it now or it should be calculated later
        grade: null,
        // if it's not a number, means you can re-submit infinitly, so you can just increase the attempts
        // this should be false, as if you have an `activeAttempt`, it means you inserted it once you created it ?
        increaseAttempts: typeof row1.attemptsAllowed !== 'number',
      });
      this.taskSchedulerService.scheduleUniqueEvent({
        event: {
          channel: Channels_Enum.review_quiz_submission,
          data: activeAttempt.quizSubmissionId,
        },
        taskId: `${Channels_Enum.review_quiz_submission}:${activeAttempt.quizSubmissionId}`,
        triggerTime: new Date(),
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
      attempts: typeof row1.attemptsAllowed === 'number' ? 1 : null,
    });
    this.taskSchedulerService.scheduleUniqueEvent({
      event: {
        channel: Channels_Enum.review_quiz_submission,
        data: attempt.quizSubmissionId,
      },
      taskId: `${Channels_Enum.review_quiz_submission}:${attempt.quizSubmissionId}`,
      triggerTime: new Date(),
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
  async submit(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizSubmissionDto: UpdateQuizSubmissionDto,
    @Req() req: Request,
  ) {
    const payload = await this.quizSubmissionsService.validateReq(req, id);
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
      await this.coursesService.authInstructorHard({
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
