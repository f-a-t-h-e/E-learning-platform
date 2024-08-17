import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { LessonsContentsService } from './lessons-contents.service';
import { CreateLessonsContentDto } from './dto/create-lessons-content.dto';
import { UpdateLessonsContentDto } from './dto/update-lessons-content.dto';
import { LessonsService } from '../lessons/lessons.service';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LessonsContentEntity } from './entities/lessons-content.entity';
import { UnauthorizedResponse } from 'src/common/entities/error-response.entity';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';

@ApiErrorResponses()
@ApiTags('lessons-contents')
@Controller('lessons-contents')
export class LessonsContentsController {
  constructor(
    private readonly lessonsContentsService: LessonsContentsService,
    private readonly lessonsService: LessonsService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: `Create a new lesson' content`,
    description: `This lets you to add a new content to a lesson in a course you are a teacher in (You can add only 1 content)`,
  })
  @ApiResponse({
    type: LessonsContentEntity,
    status: HttpStatus.CREATED,
    description: `The new content was successfully added`,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: `You have to be a teacher in this course to edit a lesson`,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @Post()
  create(
    @User() user: RequestUser,
    @Body() createLessonsContentDto: CreateLessonsContentDto,
  ) {
    if (
      !this.lessonsService.canUserEditLesson(
        user.id,
        createLessonsContentDto.id,
      )
    ) {
      throw new ForbiddenException(
        'You have to be a teacher in this course to edit a lesson',
      );
    }
    /**
     * @todo Check the content size to determine if you should save it as a file or as a string in the db
     */
    return this.lessonsContentsService.create(createLessonsContentDto, 'TEXT');
  }

  @ApiOperation({
    summary: 'Get one content',
    description: `Get a specific lesson' content using its id`,
  })
  @ApiResponse({
    type: LessonsContentEntity,
    status: HttpStatus.OK,
    description: `The content that you requested`,
  })
  @ApiParam({
    name: 'id',
    description: `The lesson id of the lesson that you want to fetch its content`,
    type: Number,
    required: true,
    example: 971,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsContentsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit one content',
    description: `Edit a specific lesson' content using its id`,
  })
  @ApiResponse({
    type: LessonsContentEntity,
    status: HttpStatus.OK,
    description: `The content that you've just edited successfully`,
  })
  @ApiParam({
    name: 'id',
    description: `The lesson id of the lesson that you want to edit its content`,
    type: Number,
    required: true,
    example: 91,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: `You have to be a teacher in this course to edit a lesson' content`,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonsContentDto: UpdateLessonsContentDto,
  ) {
    if (!this.lessonsService.canUserEditLesson(user.id, id)) {
      throw new ForbiddenException(
        `You have to be a teacher in this course to edit a lesson' content`,
      );
    }
    /**
     * @todo Check the content size to determine if you should save it as a file or as a string in the db
     */
    return this.lessonsContentsService.update(id, updateLessonsContentDto);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: `The lesson id of the lesson that you want to delete its content`,
    type: Number,
    required: true,
    example: 91,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: `You have to be a teacher in this course to delete a lesson' content`,
  })
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@User() user: RequestUser, @Param('id', ParseIntPipe) id: number) {
    if (!this.lessonsService.canUserEditLesson(user.id, id)) {
      throw new ForbiddenException(
        `You have to be a teacher in this course to delete a lesson' content`,
      );
    }
    return this.lessonsContentsService.remove(id);
  }
}
