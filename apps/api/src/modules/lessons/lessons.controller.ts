import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CoursesService } from '../courses/courses.service';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from '../../common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { UnauthorizedResponse } from '../../common/entities/error-response.entity';
import { LessonEntity } from './entities/lesson.entity';
import { TRUTHY_STRING_VALUES } from '../../common/constants';
import { ParseTruthyPipe } from '../../common/pipes/ParseTruthy.pipe';
import { RequestUser } from '../auth/entities/request-user.entity';
import { RolesDecorator } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { MarkAvailableDto } from '../../common/dto/markAvailable.dto';
import { GetOneLessonQueryDto } from './dto/get-one-lesson-query.dto';

@ApiErrorResponses()
@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly coursesService: CoursesService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new lesson',
    description: `This lets you to create a new lesson in a course you are a teacher in`,
  })
  @ApiResponse({
    type: LessonEntity,
    status: HttpStatus.CREATED,
    description: `The new lesson was successfully created`,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: `You sent invalid fields or you are not a teacher in this course`,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @Post()
  create(@User() user: RequestUser, @Body() createLessonDto: CreateLessonDto) {
    if (
      !this.coursesService.isUserATeacherAtCourse(
        user.userId,
        createLessonDto.courseId,
      )
    ) {
      throw new ForbiddenException('You are not a teacher in this course!');
    }
    return this.lessonsService.create(createLessonDto, user.userId);
  }

  @ApiOperation({
    summary: 'Get lessons',
    description: `Get the lessons related to the unit that you want`,
  })
  @ApiResponse({
    type: [LessonEntity],
    status: HttpStatus.OK,
    description: `The lessons that you requested`,
  })
  @ApiQuery({
    name: 'unitId',
    description: `The unit id that you want its lessons`,
    type: Number,
    required: true,
    example: 79,
  })
  @ApiQuery({
    name: 'getContent',
    description: `Use it to get the content of the lessons as well`,
    type: String,
    enum: TRUTHY_STRING_VALUES,
    required: true,
    example: 79,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(
    @Query('unitId', ParseIntPipe) unitId: number,
    @Query('getContent', ParseTruthyPipe) getContent: boolean,
  ) {
    return this.lessonsService.findAll(unitId, getContent);
  }

  @ApiBearerAuth()
  @ApiOperation({
    description: `Retrieve detailed information about a lesson, including optional nested data like lessons, lessons, quizzes, and media.`,
    summary: `Get a specific lesson.`,
  })
  @ApiResponse({
    type: LessonEntity,
    status: HttpStatus.OK,
    description: `The lesson that you requested.`,
  })
  @ApiParam({
    name: 'id',
    description: `The ID of the lesson to retrieve.`,
    type: 'integer',
    required: true,
    example: 1,
  })
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Query() options: GetOneLessonQueryDto,
  ): Promise<LessonEntity> {
    if (user.roleName == 'student') {
      await this.lessonsService.authStudentHard({
        lessonId: id,
        userId: user.userId,
      });
    } else {
      await this.lessonsService.authInstructorHard({
        lessonId: id,
        userId: user.userId,
      });
    }
    return this.lessonsService.findOne(id, options);
  }

  @ApiBearerAuth()
  @ApiOperation({
    description: `Retrieve detailed information about a lesson, including optional nested data like lessons, lessons, quizzes, and media. Only accessible to teachers of the lesson.`,
    summary: `Get a specific lesson. For teachers.`,
  })
  @ApiResponse({
    type: LessonEntity,
    status: HttpStatus.OK,
    description: `The lesson that you requested.`,
  })
  @ApiParam({
    name: 'id',
    description: `The ID of the lesson to retrieve.`,
    type: 'integer',
    required: true,
    example: 1,
  })
  @RolesDecorator(Role.Teacher)
  @HttpCode(HttpStatus.OK)
  @Get(':id/:edit')
  async findOneForInstructor(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Query() options: GetOneLessonQueryDto,
  ): Promise<LessonEntity> {
    await this.lessonsService.authInstructorHard({
      lessonId: id,
      userId: user.userId,
    });
    return this.lessonsService.findOne(id, options, true);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit one lesson',
    description: `Edit a specific lesson using its id`,
  })
  @ApiResponse({
    type: LessonEntity,
    status: HttpStatus.OK,
    description: `The lesson that you've just edited successfully`,
  })
  @ApiParam({
    name: 'id',
    description: `The lesson id of the lesson that you want to edit`,
    type: Number,
    required: true,
    example: 91,
  })
  @ApiQuery({
    name: 'courseId',
    description: `The course id that you want to edit its lesson (needed for easier authorization)`,
    type: Number,
    required: true,
    example: 7,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: `You are not a teacher in this course`,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonDto: UpdateLessonDto,
    @Query('courseId', ParseIntPipe) courseId: number,
  ) {
    if (!this.coursesService.isUserATeacherAtCourse(user.userId, courseId)) {
      throw new ForbiddenException('You are not a teacher in this course!');
    }
    return this.lessonsService.update(id, updateLessonDto, courseId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mark lesson as available or calculate it',
    description: `Mark the lesson as \`available\` for release or just calculate its grades.`,
  })
  @ApiParam({
    name: 'id',
    description: `The unique identifier of the lesson (\`lesson.id\`).`,
    type: Number,
    required: true,
    example: 42,
  })
  @ApiResponse({
    type: Boolean,
    status: HttpStatus.OK,
    description: `The lesson has been successfully marked as available or calculated.`,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: 'You must be a teacher of this lesson to edit it.',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Role.Teacher)
  @Patch(':id/mark-available')
  async markAsAvailable(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() markAvailableDto: MarkAvailableDto,
  ) {
    await this.lessonsService.authInstructorHard({
      lessonId: id,
      userId: user.userId,
    });
    return this.lessonsService.markAsAvailable({
      lessonId: id,
      allStates: markAvailableDto.allStates,
      auto: markAvailableDto.auto,
      state: markAvailableDto.state,
      quizPassGrade: markAvailableDto.passGrade,
    });
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: `The lesson id of the lesson that you want to delete`,
    type: Number,
    required: true,
    example: 91,
  })
  @ApiQuery({
    name: 'courseId',
    description: `The course id that you want to delete its lesson (needed for easier authorization)`,
    type: Number,
    required: true,
    example: 7,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: `You are not a teacher in this course`,
  })
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Query('courseId', ParseIntPipe) courseId: number,
  ) {
    if (!this.coursesService.isUserATeacherAtCourse(user.userId, courseId)) {
      throw new ForbiddenException('You are not a teacher in this course!');
    }
    return this.lessonsService.remove(id, courseId);
  }
}
