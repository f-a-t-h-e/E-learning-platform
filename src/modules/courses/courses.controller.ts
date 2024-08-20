import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ForbiddenException,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import { CourseEntity } from './entities/course.entity';
import { UnauthorizedResponse } from 'src/common/entities/error-response.entity';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiErrorResponses()
@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new course',
    description: `This lets you to create a new course if you are a teacher`,
  })
  @ApiResponse({
    type: CourseEntity,
    status: HttpStatus.CREATED,
    description: `The new course was successfully created`,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: 'You have to be a teacher to create a course!',
  })
  @HttpCode(HttpStatus.CREATED)
  @RolesDecorator(Role.Teacher)
  @Post()
  async create(
    @User() user: RequestUser,
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseEntity> {
    return this.coursesService.create(createCourseDto, user.id);
  }

  @ApiOperation({
    summary: 'Get courses',
    description: `Get the courses that exist on the platform`,
  })
  @ApiResponse({
    type: [CourseEntity],
    status: HttpStatus.OK,
    description: `The courses that you requested`,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<CourseEntity[]> {
    return this.coursesService.findAll();
  }

  @ApiOperation({
    summary: 'Get one course',
    description: `Get a specific course using its id`,
  })
  @ApiResponse({
    type: CourseEntity,
    status: HttpStatus.OK,
    description: `The course that you requested`,
  })
  @ApiParam({
    name: 'id',
    description: `\`course.id\``,
    type: Number,
    required: true,
    example: 7,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('get-units', ParseBoolPipe) getUnits: boolean,
    @Query('get-lessons', ParseBoolPipe) getLessons: boolean,
    @Query('get-course-material', ParseBoolPipe) getCourseMaterial: boolean,
  ): Promise<CourseEntity> {
    return this.coursesService.findOne(id, {
      getCourseMaterial,
      getLessons,
      getUnits,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get one course (for the teacher)',
    description: `Get a specific course using its id if you are a teacher in this course`,
  })
  @ApiResponse({
    type: CourseEntity,
    status: HttpStatus.OK,
    description: `The course that you requested`,
  })
  @ApiParam({
    name: 'id',
    description: `\`course.id\``,
    type: Number,
    required: true,
    example: 7,
  })
  @RolesDecorator(Role.Teacher)
  @HttpCode(HttpStatus.OK)
  @Get(':id/edit')
  async findOneForTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Query('get-units', ParseBoolPipe) getUnits: boolean,
    @Query('get-lessons', ParseBoolPipe) getLessons: boolean,
    @Query('get-course-material', ParseBoolPipe) getCourseMaterial: boolean,
  ): Promise<CourseEntity> {
    return this.coursesService.findOne(id, {
      getCourseMaterial,
      getLessons,
      getUnits,
      allMaterialState: true,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get one course (for the student)',
    description: `Get a specific course using its id if you are a student in this course`,
  })
  @ApiResponse({
    type: CourseEntity,
    status: HttpStatus.OK,
    description: `The course that you requested`,
  })
  @ApiParam({
    name: 'id',
    description: `\`course.id\``,
    type: Number,
    required: true,
    example: 7,
  })
  @RolesDecorator(Role.Student)
  @HttpCode(HttpStatus.OK)
  @Get(':id/edit')
  async findOneForStudent(
    @Param('id', ParseIntPipe) id: number,
    @Query('get-units', ParseBoolPipe) getUnits: boolean,
    @Query('get-lessons', ParseBoolPipe) getLessons: boolean,
    @Query('get-course-material', ParseBoolPipe) getCourseMaterial: boolean,
  ): Promise<CourseEntity> {
    return this.coursesService.findOne(id, {
      getCourseMaterial,
      getLessons,
      getUnits,
      allMaterialState: false,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit one course',
    description: `Edit a specific course using its id`,
  })
  @ApiResponse({
    type: Boolean,
    status: HttpStatus.OK,
    description: `The course that you've just edited successfully`,
  })
  @ApiParam({
    name: 'id',
    description: `The unit id of the course`,
    type: Number,
    required: true,
    example: 7,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: 'You have to be a teacher in this course to edit it!',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Role.Teacher)
  @Patch(':id')
  async update(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    await this.coursesService.authHard({ courseId: id, userId: user.id });
    return this.coursesService.update(id, updateCourseDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete one course',
    description: `Delete a specific course using its id`,
  })
  @ApiResponse({
    type: Boolean,
    status: HttpStatus.OK,
    description: `The course that you've just deleted successfully`,
  })
  @ApiParam({
    name: 'id',
    description: `The unit id of the course`,
    type: Number,
    required: true,
    example: 7,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: 'You have to be a teacher in this course to delete it!',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Role.Teacher)
  @Delete(':id')
  async remove(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.coursesService.authHard({ courseId: id, userId: user.id });
    return this.coursesService.remove(id);
  }
}
