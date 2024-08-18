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
import { CreateMediaResponseDto } from './dto/create-media.response.dto';
import { RequestUser } from '../auth/entities/request-user.entity';

import { FileValidationInterceptor } from 'src/common/interceptors/file-validation.interceptor';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';

import JwtGuard from '../auth/guards/jwt.guard';

import { createFile } from 'src/common/utils/createFile';
import { fileStatAsync } from 'src/common/utils/fileStatAsync';
import { getFilePath } from 'src/common/utils/getFilePath';

@ApiErrorResponses()
@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly lessonsService: LessonsService,
    private readonly coursesService: CoursesService,
  ) {}

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: `The details that you need to track/continue your file upload process`,
    schema: {
      type: 'number',
      example: 457358,
      description: `The number of bytes uploaded`,
    },
  })
  @UseGuards(JwtGuard)
  @Get('/track-upload/:id')
  async getUploadStats(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const media = await this.mediaService.findOne(id);
    if (media.profileId !== user.id) {
      throw new ForbiddenException(`You have no access to this media details`);
    }
    if (media.url !== 'id') {
      return media.bytes;
    }
    const filePath = getFilePath({
      userId: user.id,
      mediaId: media.id,
      extension: media.extension,
    });
    const stats = await fileStatAsync(filePath);
    if (!stats) {
      throw new InternalServerErrorException(
        `This file has issues (wasn't created), please contact support if needed`,
      );
    }
    return stats.size;
  }

  @ApiBearerAuth()
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
  @UseGuards(JwtGuard)
  @UseInterceptors(FileValidationInterceptor)
  @Post('upload/:id')
  async uploadMedia() {
    return {
      success: true,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Prepare the upload for your file' })
  @ApiBody({
    type: CreateMediaDto,
    description: `The details about the \`media\` that you want to upload`,
  })
  @ApiResponse({
    type: CreateMediaResponseDto,
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
  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createMediaDto: CreateMediaDto,
    @User() user: RequestUser,
  ) {
    if (createMediaDto.lessonId) {
      const isAllowed =
        await this.lessonsService.getCourseFromUserIdAndLessonId(
          user.id,
          createMediaDto.lessonId,
        );
      if (isAllowed !== false) {
        createMediaDto.courseId = isAllowed;
      } else {
        throw new ForbiddenException(`You don't have access to this lesson`);
      }
    } else if (createMediaDto.courseId) {
      const isAllowed = await this.coursesService.isUserATeacherAtCourse(
        user.id,
        createMediaDto.courseId,
      );
      if (!isAllowed) {
        throw new ForbiddenException(`You don't have access to this course`);
      }
    }
    const media = await this.mediaService.create({
      ...createMediaDto,
      profileId: user.id,
    });
    const filePath = getFilePath({
      userId: user.id,
      extension: media.extension,
      mediaId: media.id,
    });
    await createFile(filePath);
    // return {
    //   ...media,
    //   bytes: media.bytes.toString(),
    // };
    return media;
  }
}
