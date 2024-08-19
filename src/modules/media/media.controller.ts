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

import { FileValidationInterceptor } from 'src/common/interceptors/file-validation.interceptor';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';

import JwtGuard from '../auth/guards/jwt.guard';

import { createFile } from 'src/common/utils/createFile';
import { fileStatAsync } from 'src/common/utils/fileStatAsync';
import { fileTargetMap } from 'src/common/utils/getFilePath';
import path from 'path';
import { UnitsService } from '../units/units.service';
import { Media } from '@prisma/client';
import { MediaEntity } from './entities/media.entity';

@ApiBearerAuth()
@ApiErrorResponses()
@ApiTags('media')
@UseGuards(JwtGuard)
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly lessonsService: LessonsService,
    private readonly unitsService: UnitsService,
    private readonly coursesService: CoursesService,
  ) {}

  @ApiOperation({ summary: 'Prepare the upload for your file' })
  @ApiBody({
    type: CreateMediaDto,
    description: `The details about the \`media\` that you want to upload`,
  })
  @ApiResponse({
    type: MediaEntity,
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
  ) {
    let media: Media;
    switch (createMediaDto.target) {
      case 'PROFILE_BANNER':
      case 'PROFILE_PICTURE':
        media = await this.mediaService.create({
          profileId: user.id,
          extension: createMediaDto.extension,
          type: createMediaDto.type,
          target: createMediaDto.target,
          url: path.join(...fileTargetMap[createMediaDto.target](user.id)),
        });
        break;
      case 'COURSE_BANNER':
      case 'COURSE_MATERIAL':
        const isCourseAvailable =
          await this.coursesService.isUserATeacherAtCourse(
            user.id,
            createMediaDto.courseId,
          );
        if (!isCourseAvailable) {
          throw new ForbiddenException(
            `You don't have access to edit this course`,
          );
        }
        media = await this.mediaService.create({
          profileId: user.id,
          extension: createMediaDto.extension,
          courseId: createMediaDto.courseId,
          type: createMediaDto.type,
          target: createMediaDto.target,
          url: path.join(
            ...fileTargetMap[createMediaDto.target](createMediaDto.courseId),
          ),
        });
        break;
      case 'UNIT_BANNER':
      case 'UNIT_MATERIAL':
        const unitDetails =
          await this.unitsService.getCourseFromUserIdAndUnitId(
            user.id,
            createMediaDto.unitId,
          );
        if (unitDetails == false) {
          throw new ForbiddenException(`You don't have access to this lesson`);
        }
        media = await this.mediaService.create({
          profileId: user.id,
          extension: createMediaDto.extension,
          courseId: createMediaDto.courseId,
          type: createMediaDto.type,
          target: createMediaDto.target,
          url: path.join(
            ...fileTargetMap[createMediaDto.target](
              unitDetails.courseId,
              createMediaDto.unitId,
            ),
          ),
        });
        break;
      case 'LESSON_BANNER':
      case 'LESSON_MATERIAL':
        const lessonDetails =
          await this.lessonsService.getCourseFromUserIdAndLessonId(
            user.id,
            createMediaDto.lessonId,
          );
        if (lessonDetails == false) {
          throw new ForbiddenException(`You don't have access to this lesson`);
        }
        media = await this.mediaService.create({
          profileId: user.id,
          extension: createMediaDto.extension,
          courseId: createMediaDto.courseId,
          type: createMediaDto.type,
          target: createMediaDto.target,
          url: path.join(
            ...fileTargetMap[createMediaDto.target](
              lessonDetails.courseId,
              lessonDetails.unitId,
              createMediaDto.lessonId,
            ),
          ),
        });
        break;
      default:
        console.error(`Invalid field "target"`);

        throw new InternalServerErrorException();
    }
    await createFile(
      path.join(
        process.cwd(),
        media.url,
        `${user.id}_${media.id}.${media.extension}`,
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
    name: 'id',
    description: `\`media.id\` that you are uploading.`,
    schema: {
      type: 'number',
      example: 1,
      nullable: false,
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
  @Post('upload/:id')
  async uploadMedia() {
    return {
      success: true,
    };
  }

  @ApiOperation({ summary: `Get the media details to know your next step`})
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: `The details that you need to track/continue your file upload process`,
    type: MediaEntity,
  })
  @Get('track-upload/:id')
  async getUploadStats(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const media = await this.mediaService.findOne(id);
    if (media.profileId !== user.id) {
      throw new ForbiddenException(`You have no access to this media details`);
    }
    if (media.state == 'FAILED') {
      return {
        message: 'This media file seems to be failed',
        success: false,
      };
    }
    if (media.state == 'UPLOADED') {
      return {
        success: true,
        data: { media },
      };
    }

    if (media.state == 'UPLOADING') {
      const stats = await fileStatAsync(
        path.join(
          process.cwd(),
          media.url,
          `${user.id}_${media.id}.${media.extension}`,
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
    type: MediaEntity,
    status: 200,
  })
  @HttpCode(HttpStatus.OK)
  @Patch('complete/:id')
  complete(@Param('id', ParseIntPipe) id: number, @User() user: RequestUser) {
    return this.mediaService.completeMedia(id, user.id);
  }
}
