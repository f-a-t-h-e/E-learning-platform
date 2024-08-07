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
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { CoursesService } from '../courses/courses.service';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('units')
export class UnitsController {
  constructor(
    private readonly unitsService: UnitsService,
    private readonly coursesService: CoursesService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@User() user: RequestUser, @Body() createUnitDto: CreateUnitDto) {
    if (
      !this.coursesService.isUserATeacherAtCourse(
        user.id,
        createUnitDto.courseId,
      )
    ) {
      throw new BadRequestException('You are not a teacher in this course!');
    }
    return this.unitsService.create(createUnitDto, user.id);
  }

  @Get()
  findAll(@Query('courseId') courseIdString: string) {
    const courseId = parseInt(`${courseIdString}`);
    if (isNaN(courseId)) {
      throw new BadRequestException('Invalid query param courseId');
    }
    return this.unitsService.findAll(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (isNaN(+id)) {
      throw new NotFoundException(`This unit doesn't exist`);
    }
    return this.unitsService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @User() user: RequestUser,
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
    @Query('courseId') courseIdString: string,
  ) {
    const courseId = parseInt(`${courseIdString}`);
    if (isNaN(courseId)) {
      throw new BadRequestException('Invalid query param unitId');
    }
    if (isNaN(+id)) {
      throw new NotFoundException(`This unit doesn't exist`);
    }
    if (!this.coursesService.isUserATeacherAtCourse(user.id, courseId)) {
      throw new BadRequestException('You are not a teacher in this course!');
    }
    return this.unitsService.update(+id, updateUnitDto, courseId);
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
      throw new NotFoundException(`This unit doesn't exist`);
    }
    if (!this.coursesService.isUserATeacherAtCourse(user.id, courseId)) {
      throw new BadRequestException('You are not a teacher in this course!');
    }
    return this.unitsService.remove(+id, courseId);
  }
}
