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
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CoursesService } from '../courses/courses.service';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly coursesService: CoursesService,
  ) {}

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

  @Get()
  findAll(@Query('unitId') unitIdString: string) {
    const unitId = parseInt(`${unitIdString}`);
    if (isNaN(unitId)) {
      throw new BadRequestException('Invalid query param unitId');
    }
    return this.lessonsService.findAll(unitId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (isNaN(+id)) {
      throw new NotFoundException(`This lesson doesn't exist`);
    }
    return this.lessonsService.findOne(+id);
  }

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
