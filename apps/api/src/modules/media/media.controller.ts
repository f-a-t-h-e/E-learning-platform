import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  HttpStatus,
  UseGuards,
  ForbiddenException,
  HttpCode,
  ParseIntPipe,
  InternalServerErrorException,
  Patch,
  forwardRef,
  Inject,
  BadRequestException,
  ParseEnumPipe,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MediaService } from './media.service';
import { LessonsService } from '../lessons/lessons.service';
import { CoursesService } from '../courses/courses.service';

import { CreateMediaDto } from './dto/create-media.dto';
import { RequestUser } from '../auth/entities/request-user.entity';

import { FileValidationInterceptor } from './interceptors/file-validation.interceptor';
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { User } from '../../common/decorators/user.decorator';

import JwtGuard from '../auth/guards/jwt.guard';

import { createFile } from './utils/createFile';
import { fileStatAsync } from './utils/fileStatAsync';
import { fileTargetMap } from './utils/fileTargetMap';
import path from 'path';
import { UnitsService } from '../units/units.service';
import { parseMediaFields } from './utils/parseMediaFields';
import { UserProfileService } from '../user-profile/user-profile.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { QuizSubmissionsService } from '../quiz-submissions/quiz-submissions.service';
import { CompleteMediaDto } from './dto/complete-media.dto';
import { MediaPurposeEnum, MediaPurposeTargetEnum } from './media-purpose.enum';
import { Request } from 'express';

@ApiBearerAuth()
@ApiErrorResponses()
@ApiTags('media')
@UseGuards(JwtGuard)
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    @Inject(forwardRef(() => UserProfileService))
    private readonly userProfileService: UserProfileService,
    @Inject(forwardRef(() => QuizzesService))
    private readonly quizzesService: QuizzesService,
    @Inject(forwardRef(() => QuizSubmissionsService))
    private readonly quizSubmissionsService: QuizSubmissionsService,
    @Inject(forwardRef(() => CoursesService))
    private readonly coursesService: CoursesService,
    @Inject(forwardRef(() => UnitsService))
    private readonly unitsService: UnitsService,
    @Inject(forwardRef(() => LessonsService))
    private readonly lessonsService: LessonsService,
  ) {}

  @ApiOperation({ summary: 'Prepare the upload for your file' })
  @ApiBody({
    type: CreateMediaDto,
    description: `The details about the \`media\` that you want to upload`,
  })
  @ApiResponse({
    links: {
      'Get Media Id': {
        operationId: `UploadFileChunks`,
        parameters: {
          id: '$response.body#/id',
        },
      },
    },
    status: 201,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createMediaDto: CreateMediaDto,
    @User() user: RequestUser,
    @Req() req: Request,
  ) {
    let targetId;
    if (createMediaDto.purpose !== 'single_question_answer') {
      delete createMediaDto.questionId;
    }
    switch (createMediaDto.purpose) {
      case 'quiz_banner':
      case 'quiz_material':
        targetId = createMediaDto.quizId;
        await this.quizzesService.authInstructorHardPerQuiz({
          userId: user.userId,
          quizId: targetId,
        });
        break;
      case 'unit_banner':
      case 'unit_material':
        targetId = createMediaDto.unitId;
        await this.unitsService.authHard({
          userId: user.userId,
          unitId: targetId,
        });
        break;
      case 'course_banner':
      case 'course_material':
        targetId = createMediaDto.courseId;
        await this.coursesService.authHard({
          userId: user.userId,
          courseId: targetId,
        });
        break;
      case 'lesson_banner':
      case 'lesson_material':
        targetId = createMediaDto.lessonId;
        await this.lessonsService.authHard({
          userId: user.userId,
          lessonId: targetId,
        });
        break;
      case 'profile_banner':
      case 'profile_photo':
        targetId = user.userId;
        break;
      case 'full_quiz_answers':
        targetId = createMediaDto.quizSubmissionId;
        await this.quizSubmissionsService.validateReq(req, targetId);
        break;
      case 'single_question_answer':
        targetId = createMediaDto.quizSubmissionId;
        if (!createMediaDto.questionId) {
          throw new BadRequestException(
            `This field "questionId" is required for this purpose "single_question_answer"`,
          );
        }
        const sPayload = await this.quizSubmissionsService.validateReq(
          req,
          targetId,
        );
        if (
          !Object.prototype.hasOwnProperty.call(
            sPayload.questions,
            createMediaDto.questionId,
          )
        ) {
          throw new BadRequestException(
            `This questionId is not part of your quizSubmision' quiz' questions.`,
          );
        }
        break;
      case 'part_of_the_quiz_answers':
        targetId = createMediaDto.quizSubmissionId;
        await this.quizSubmissionsService.validateReq(req, targetId);
        break;
      default:
        console.error(`Invalid field "purpose"`);
        throw new InternalServerErrorException();
    }
    delete createMediaDto.courseId;
    delete createMediaDto.unitId;
    delete createMediaDto.lessonId;
    delete createMediaDto.quizId;
    delete createMediaDto.quizSubmissionId;
    createMediaDto[MediaPurposeTargetEnum[createMediaDto.purpose].targetId] =
      targetId;
    const media = await this.mediaService.create({
      ...createMediaDto,
      profileId: user.userId,
    });
    const url = fileTargetMap[media.purpose](
      // @ts-expect-error This returns the correct values as it has the same mapping
      parseMediaFields[media.purpose](createMediaDto, user),
    );
    await createFile(
      path.join(
        process.cwd(),
        ...url,
        `${user.userId}_${media.id}.${media.extension}`,
      ),
    );
    return media;
  }

  @ApiOperation({
    summary: 'Upload a file for a course',
    //  operationId: 'UploadFileChunks',
  })
  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'content-range',
    description: `The \`Content-Range\` response HTTP header indicates where in a full body message a partial message belongs.
    Here it's used to know where to add the current chunk of the file.`,
    schema: {
      type: 'string',
      example: `bytes 1000-2000/10000`,
      nullable: false,
      pattern: `^bytes (\\d+)-(\\d+)/(\\d+)$`,
    },
  })
  @ApiParam({
    name: 'purpose',
    description: `\`media.purpose\` that you are uploading.`,
    enum: MediaPurposeEnum,
    example: MediaPurposeEnum.course_banner,
  })
  @ApiParam({
    name: 'id',
    description: `\`media.id\` that you are uploading.`,
    schema: {
      type: 'integer',
      minimum: 1,
      example: 1,
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The file has been successfully uploaded.',
  })
  @UseInterceptors(FileValidationInterceptor)
  @Post('upload/:purpose/:id')
  async uploadMedia() {
    return {
      success: true,
    };
  }

  @ApiOperation({ summary: `Get the media details to know your next step` })
  @ApiParam({
    name: 'purpose',
    description: `\`media.purpose\` that you are uploading.`,
    enum: MediaPurposeEnum,
    example: MediaPurposeEnum.course_banner,
  })
  @ApiParam({
    name: 'id',
    description: `\`media.id\` that you are uploading.`,
    schema: {
      type: 'integer',
      minimum: 1,
      example: 1,
    },
  })
  @ApiResponse({
    status: 200,
    description: `The details that you need to track/continue your file upload process`,
  })
  @Get('track-upload/:purpose/:id')
  async getUploadStats(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Param('purpose', new ParseEnumPipe(MediaPurposeEnum))
    purpose: keyof MediaPurposeEnum,
  ) {
    const media = await this.mediaService.findOne(id, purpose);
    if (media.userId !== user.userId) {
      throw new ForbiddenException(`You have no access to this media details`);
    }
    if (media.state == 'failed') {
      return {
        message: 'This media file seems to be failed',
        success: false,
      };
    }
    if (media.state == 'uploaded') {
      return {
        success: true,
        data: { media },
      };
    }

    if (media.state == 'uploading') {
      const stats = await fileStatAsync(
        path.join(
          process.cwd(),
          media.url,
          `${user.userId}_${id}.${media.extension}`,
        ),
      );
      if (!stats) {
        throw new InternalServerErrorException(
          `This file has issues (wasn't created), please contact support if needed`,
        );
      }
      return {
        success: true,
        data: { media, size: stats.size },
      };
    }
    console.error(`Invalid value for "media.state" : "${media.state}" .`);

    throw new InternalServerErrorException();
  }

  @ApiOperation({ summary: 'Mark the upload for your file as completed' })
  @ApiResponse({
    // type: CombinedMediaEntity,
    status: 200,
  })
  @HttpCode(HttpStatus.OK)
  @Patch('complete')
  async complete(
    @Body() completeMediaDto: CompleteMediaDto,
    @User() user: RequestUser,
  ) {
    const media = await this.mediaService.completeMedia(
      completeMediaDto.id,
      user.userId,
      completeMediaDto.purpose,
    );
    switch (media.purpose) {
      case 'quiz_banner':
        await this.quizzesService.updateBanner(media.quizId!, media.url);
        break;
      case 'quiz_material':
        break;
      case 'unit_banner':
        await this.unitsService.updateBanner(media.unitId, media.url);
        break;
      case 'unit_material':
        break;
      case 'course_banner':
        await this.coursesService.updateBanner(media.courseId, media.url);
        break;
      case 'course_material':
        break;
      case 'lesson_banner':
        await this.lessonsService.updateBanner(media.lessonId, media.url);
        break;
      case 'lesson_material':
        break;
      case 'profile_banner':
        await this.userProfileService.updateBanner(media.userId, media.url);
        break;
      case 'profile_photo':
        await this.userProfileService.updatePhoto(media.userId, media.url);
        break;
      case 'full_quiz_answers':
        await this.quizSubmissionsService.submitFullQuiz(
          media.quizSubmissionId!,
        );
        break;
      case 'part_of_the_quiz_answers':
        await this.quizSubmissionsService.submitSingleQuestion();
        break;
      case 'single_question_answer':
        await this.quizSubmissionsService.submitPartOfTheQuiz();
        break;
      default:
        break;
    }

    return media;
  }
}
