import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  ForbiddenException,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { RolesDecorator } from '../../common/decorators/roles.decorator';
import { User } from '../../common/decorators/user.decorator';
import { Role } from '../../common/enums/role.enum';

import { CreateCourseEnrollmentDto } from './dto/create-course-enrollment.dto';
import { CreateManyCourseEnrollments } from './dto/create-many-course-enrollments.dto';
import { UpdateCourseEnrollments } from './dto/update-courses-enrollment.dto';

import { CoursesEnrollmentEntity } from './entities/courses-enrollment.entity';
import { RequestUser } from '../auth/entities/request-user.entity';

import { CoursesEnrollmentsService } from './courses-enrollments.service';

@ApiBearerAuth()
@ApiErrorResponses()
@ApiTags('Courses Enrollments')
@Controller('courses-enrollments')
export class CoursesEnrollmentsController {
  constructor(
    private readonly coursesEnrollmentsService: CoursesEnrollmentsService,
  ) {}

  @ApiOperation({ summary: 'Enroll in a course (Requested by student)' })
  @ApiResponse({
    status: 201,
    description: 'Successfully enrolled in the course',
    type: CoursesEnrollmentEntity,
  })
  @RolesDecorator(Role.Student)
  @Post()
  create(
    @User() user: RequestUser,
    @Body() createCoursesEnrollmentDto: CreateCourseEnrollmentDto,
  ) {
    return this.coursesEnrollmentsService.create(
      createCoursesEnrollmentDto,
      user.userId,
    );
  }

  @ApiOperation({ summary: 'Enroll many students in a course' })
  @ApiResponse({
    status: 201,
    description: 'Successfully enrolled the students in the course',
    type: Number,
  })
  @RolesDecorator(Role.Teacher)
  @Post('many')
  async createMany(
    @User() user: RequestUser,
    @Body() createManyCourseEnrollments: CreateManyCourseEnrollments,
  ) {
    const result = await this.coursesEnrollmentsService.createMany(
      createManyCourseEnrollments,
      user.userId,
    );
    if (result.success == false) {
      if (result.error instanceof ForbiddenException) {
        throw result.error;
      }
      throw new InternalServerErrorException();
    }
    return result;
  }

  @ApiOperation({ summary: 'Find all students in a course' })
  @ApiQuery({ name: 'courseId', type: Number })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  @RolesDecorator(Role.Teacher)
  @Get()
  findAllStudentsInCourse(
    @User() user: RequestUser,
    @Query('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.coursesEnrollmentsService.findAllStudentsInCourse(
      courseId,
      user.userId,
    );
  }

  @ApiOperation({
    summary: `Alter students' enrollments in a course you are a teacher in`,
  })
  @RolesDecorator(Role.Teacher)
  @Patch()
  remove(
    @User() user: RequestUser,
    @Body() updateCourseEnrollments: UpdateCourseEnrollments,
  ) {
    return this.coursesEnrollmentsService.removeMany(
      updateCourseEnrollments.studentIds,
      updateCourseEnrollments.courseId,
      user.userId,
    );
  }
}
