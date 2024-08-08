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
  UnauthorizedException,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CoursesService } from '../courses/courses.service';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import { UnauthorizedResponse } from 'src/common/entities/error-response.entity';
import { Lesson } from './entities/lesson.entity';
import { TRUTHY_STRING_VALUES } from 'src/common/constants';
import { ParseTruthyPipe } from 'src/common/pipes/ParseTruthy.pipe';

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
    type: Lesson,
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
        user.id,
        createLessonDto.courseId,
      )
    ) {
      throw new UnauthorizedException('You are not a teacher in this course!');
    }
    return this.lessonsService.create(createLessonDto, user.id);
  }

  @ApiOperation({
    summary: 'Get lessons',
    description: `Get the lessons related to the unit that you want`,
  })
  @ApiResponse({
    type: [Lesson],
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

  @ApiOperation({
    summary: 'Get one lesson',
    description: `Get a specific lesson using its id`,
  })
  @ApiResponse({
    type: Lesson,
    status: HttpStatus.OK,
    description: `The lesson that you requested`,
  })
  @ApiParam({
    name: 'id',
    description: `The lesson id of the lesson that you want to fetch`,
    type: Number,
    required: true,
    example: 971,
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
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('getContent', ParseTruthyPipe) getContent: boolean,
  ) {
    return this.lessonsService.findOne(id, getContent);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit one lesson',
    description: `Edit a specific lesson using its id`,
  })
  @ApiResponse({
    type: Lesson,
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
    if (!this.coursesService.isUserATeacherAtCourse(user.id, courseId)) {
      throw new UnauthorizedException('You are not a teacher in this course!');
    }
    return this.lessonsService.update(id, updateLessonDto, courseId);
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
    if (!this.coursesService.isUserATeacherAtCourse(user.id, courseId)) {
      throw new UnauthorizedException('You are not a teacher in this course!');
    }
    return this.lessonsService.remove(id, courseId);
  }
}
