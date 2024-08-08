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
  ParseIntPipe,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
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
import { Unit } from './entities/unit.entity';
import { BadRequestResponse } from 'src/common/entities/error-response.entity';

@ApiErrorResponses()
@ApiTags('units')
@Controller('units')
export class UnitsController {
  constructor(
    private readonly unitsService: UnitsService,
    private readonly coursesService: CoursesService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new unit',
    description: `This lets you to create a new unit in a course you are a teacher in`,
  })
  @ApiResponse({
    type: Unit,
    status: HttpStatus.CREATED,
    description: `The new unit was successfully created`,
  })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: `You sent invalid fields or you are not a teacher`,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @Post()
  create(
    @User() user: RequestUser,
    @Body() createUnitDto: CreateUnitDto,
  ): Promise<Unit> {
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

  @ApiOperation({
    summary: 'Get units',
    description: `Get the units related to the course that you want`,
  })
  @ApiResponse({
    type: [Unit],
    status: HttpStatus.OK,
    description: `The units that you requested`,
  })
  @ApiQuery({
    name: 'courseId',
    description: `The course id that you want its units`,
    type: Number,
    required: true,
    example: 7,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query('courseId', ParseIntPipe) courseId: number): Promise<Unit[]> {
    return this.unitsService.findAll(courseId);
  }

  @ApiOperation({
    summary: 'Get one unit',
    description: `Get a specific unit using its id`,
  })
  @ApiResponse({
    type: Unit,
    status: HttpStatus.OK,
    description: `The unit that you requested`,
  })
  @ApiParam({
    name: 'id',
    description: `The unit id of the unit that you want to fetch`,
    type: Number,
    required: true,
    example: 91,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Unit> {
    return this.unitsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit one unit',
    description: `Edit a specific unit using its id`,
  })
  @ApiResponse({
    type: Unit,
    status: HttpStatus.OK,
    description: `The unit that you've just edit successfully`,
  })
  @ApiParam({
    name: 'id',
    description: `The unit id of the unit that you want to edit`,
    type: Number,
    required: true,
    example: 91,
  })
  @ApiQuery({
    name: 'courseId',
    description: `The course id that you want to edit its unit (needed for easier authorization)`,
    type: Number,
    required: true,
    example: 7,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUnitDto: UpdateUnitDto,
    @Query('courseId', ParseIntPipe) courseId: number,
  ) {
    if (!this.coursesService.isUserATeacherAtCourse(user.id, courseId)) {
      throw new BadRequestException('You are not a teacher in this course!');
    }
    return this.unitsService.update(id, updateUnitDto, courseId);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: `The unit id of the unit that you want to delete`,
    type: Number,
    required: true,
    example: 91,
  })
  @ApiQuery({
    name: 'courseId',
    description: `The course id that you want to delete its unit (needed for easier authorization)`,
    type: Number,
    required: true,
    example: 7,
  })
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Query('courseId', ParseIntPipe) courseId: number,
  ) {
    if (!this.coursesService.isUserATeacherAtCourse(user.id, courseId)) {
      throw new BadRequestException('You are not a teacher in this course!');
    }
    return this.unitsService.remove(id, courseId);
  }
}
