import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
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
import { Course } from './entities/course.entity';
import { BadRequestResponse } from 'src/common/entities/error-response.entity';

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
    type: Course,
    status: HttpStatus.CREATED,
    description: `The new course was successfully created`,
  })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: `You sent invalid fields or you are not a teacher`,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @Post()
  async create(
    @User() user: RequestUser,
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    if (user.roleName !== 'teacher') {
      throw new BadRequestException(
        'You have to be a teacher to create a course!',
      );
    }
    return this.coursesService.create(createCourseDto, user.id);
  }

  @ApiOperation({
    summary: 'Get courses',
    description: `Get the courses that exist on the platform`,
  })
  @ApiResponse({
    type: [Course],
    status: HttpStatus.OK,
    description: `The courses that you requested`,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @ApiOperation({
    summary: 'Get one course',
    description: `Get a specific course using its id`,
  })
  @ApiResponse({
    type: Course,
    status: HttpStatus.OK,
    description: `The course that you requested`,
  })
  @ApiParam({
    name: 'id',
    description: `The unit id of the course`,
    type: Number,
    required: true,
    example: 7,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit one course',
    description: `Edit a specific course using its id`,
  })
  @ApiResponse({
    type: Course,
    status: HttpStatus.OK,
    description: `The course that you've just edit successfully`,
  })
  @ApiParam({
    name: 'id',
    description: `The unit id of the course`,
    type: Number,
    required: true,
    example: 7,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    if (user.roleName !== 'teacher') {
      throw new BadRequestException(
        'You have to be a teacher to edit a course!',
      );
    }
    return this.coursesService.update(id, updateCourseDto, user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete one course',
    description: `Delete a specific course using its id`,
  })
  @ApiResponse({
    type: Course,
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Course> {
    if (user.roleName !== 'teacher') {
      throw new BadRequestException(
        'You have to be a teacher to remove a course!',
      );
    }
    return this.coursesService.remove(id, user.id);
  }
}
