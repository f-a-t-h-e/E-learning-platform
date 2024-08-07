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
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("courses")
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  async create(
    @User() user: RequestUser,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    if (user.roleName !== 'teacher') {
      throw new BadRequestException(
        'You have to be a teacher to create a course!',
      );
    }
    return this.coursesService.create(createCourseDto, user.id);
  }

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @User() user: RequestUser,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    if (user.roleName !== 'teacher') {
      throw new BadRequestException(
        'You have to be a teacher to edit a course!',
      );
    }
    return this.coursesService.update(+id, updateCourseDto, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@User() user: RequestUser, @Param('id') id: string) {
    if (user.roleName !== 'teacher') {
      throw new BadRequestException(
        'You have to be a teacher to remove a course!',
      );
    }
    return this.coursesService.remove(+id, user.id);
  }
}
