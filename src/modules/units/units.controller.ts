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
  Inject,
  forwardRef,
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
import { UnitEntity } from './entities/unit.entity';
import { UnauthorizedResponse } from 'src/common/entities/error-response.entity';
import { RequestUser } from '../auth/entities/request-user.entity';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { MarkAvailableDto } from 'src/common/dto/markAvailable.dto';

@ApiErrorResponses()
@ApiTags('units')
@Controller('units')
export class UnitsController {
  constructor(
    private readonly unitsService: UnitsService,
    @Inject(forwardRef(() => CoursesService))
    private readonly coursesService: CoursesService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new unit',
    description: `This lets you to create a new unit in a course you are a teacher in`,
  })
  @ApiResponse({
    type: UnitEntity,
    status: HttpStatus.CREATED,
    description: `The new unit was successfully created`,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: `You are not a teacher`,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @Post()
  create(
    @User() user: RequestUser,
    @Body() createUnitDto: CreateUnitDto,
  ): Promise<UnitEntity> {
    if (
      !this.coursesService.isUserATeacherAtCourse(
        user.userId,
        createUnitDto.courseId,
      )
    ) {
      throw new ForbiddenException('You are not a teacher in this course!');
    }
    return this.unitsService.create(createUnitDto, user.userId);
  }

  @ApiOperation({
    summary: 'Get units',
    description: `Get the units related to the course that you want`,
  })
  @ApiResponse({
    type: [UnitEntity],
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
  findAll(
    @Query('courseId', ParseIntPipe) courseId: number,
  ): Promise<UnitEntity[]> {
    return this.unitsService.findAll(courseId);
  }

  @ApiOperation({
    summary: 'Get one unit',
    description: `Get a specific unit using its id`,
  })
  @ApiResponse({
    type: UnitEntity,
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
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UnitEntity> {
    return this.unitsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Edit one unit',
    description: `Edit a specific unit using its id`,
  })
  @ApiResponse({
    type: UnitEntity,
    status: HttpStatus.OK,
    description: `The unit that you've just edited successfully`,
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
    @Body() updateUnitDto: UpdateUnitDto,
    @Query('courseId', ParseIntPipe) courseId: number,
  ) {
    if (!this.coursesService.isUserATeacherAtCourse(user.userId, courseId)) {
      throw new ForbiddenException('You are not a teacher in this course!');
    }
    return this.unitsService.update(id, updateUnitDto, courseId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mark unit as available or calculate it',
    description: `Mark the unit as \`available\` for release or just calculate its grades.`,
  })
  @ApiParam({
    name: 'id',
    description: `The unique identifier of the unit (\`unit.id\`).`,
    type: Number,
    required: true,
    example: 15,
  })
  @ApiResponse({
    type: Boolean,
    status: HttpStatus.OK,
    description: `The unit has been successfully marked as available or calculated.`,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: 'You must be a teacher of this unit to edit it.',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Role.Teacher)
  @Patch(':id/mark-available')
  async markAsAvailable(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() markAvailableDto: MarkAvailableDto,
  ) {
    await this.unitsService.authHard({ unitId: id, userId: user.userId });
    return this.unitsService.markAsAvailable({
      unitId: id,
      allStates: markAvailableDto.allStates,
      auto: markAvailableDto.auto,
    });
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
    return this.unitsService.remove(id, courseId);
  }
}
