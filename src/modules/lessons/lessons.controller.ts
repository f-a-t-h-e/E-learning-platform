import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
  NotFoundException,
  HttpStatus,
  HttpCode,
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
import { BadRequestResponse } from 'src/common/entities/error-response.entity';
import { Lesson } from './entities/lesson.entity';

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
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: `You sent invalid fields or you are not a teacher`,
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
      throw new BadRequestException('You are not a teacher in this course!');
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
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query('unitId') unitIdString: string) {
    const unitId = parseInt(`${unitIdString}`);
    if (isNaN(unitId)) {
      throw new BadRequestException('Invalid query param unitId');
    }
    return this.lessonsService.findAll(unitId);
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
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (isNaN(+id)) {
      throw new NotFoundException(`This lesson doesn't exist`);
    }
    return this.lessonsService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit one lesson',
    description: `Edit a specific lesson using its id`,
  })
  @ApiResponse({
    type: Lesson,
    status: HttpStatus.OK,
    description: `The lesson that you've just edit successfully`,
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @User() user: RequestUser,
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @Query('courseId') courseIdString: string,
  ) {
    const courseId = parseInt(`${courseIdString}`);
    if (isNaN(courseId)) {
      throw new BadRequestException('Invalid query param unitId');
    }
    if (isNaN(+id)) {
      throw new NotFoundException(`This lesson doesn't exist`);
    }
    if (!this.coursesService.isUserATeacherAtCourse(user.id, courseId)) {
      throw new BadRequestException('You are not a teacher in this course!');
    }
    return this.lessonsService.update(+id, updateLessonDto, courseId);
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
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(
    @User() user: RequestUser,
    @Param('id') id: string,
    @Query('courseId') courseIdString: string,
  ) {
    const courseId = parseInt(`${courseIdString}`);
    if (isNaN(courseId)) {
      throw new BadRequestException('Invalid query param unitId');
    }
    if (isNaN(+id)) {
      throw new NotFoundException(`This lesson doesn't exist`);
    }
    if (!this.coursesService.isUserATeacherAtCourse(user.id, courseId)) {
      throw new BadRequestException('You are not a teacher in this course!');
    }
    return this.lessonsService.remove(+id, courseId);
  }
}
