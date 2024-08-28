import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { RequestUser } from '../auth/entities/request-user.entity';
import { UnauthorizedResponse } from 'src/common/entities/error-response.entity';
import { MarkAvailableDto } from 'src/common/dto/markAvailable.dto';
import { ParseOptionalId } from 'src/common/pipes/ParseOptionalId.pipe';
import { GetManyQuizzesQueryDto } from './dto/queries/get-many-quizzes-query.dto';

@ApiBearerAuth()
@ApiErrorResponses()
@ApiTags('Quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @RolesDecorator(Role.Teacher)
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({
    status: 201,
    description: 'The quiz has been successfully created.',
  })
  async create(
    @Body() createQuizDto: CreateQuizDto,
    @User() user: RequestUser,
  ) {
    // Authorize & validate data
    this.quizzesService.validateCreateAuthDetails(
      await this.quizzesService.getCreateAuthDetails(
        createQuizDto,
        user.userId,
      ),
      createQuizDto,
    );
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get many quizzes' })
  @ApiResponse({ status: 200, description: 'Return many quizzes.' })
  async findMany(
    @Query() query: GetManyQuizzesQueryDto,
    @User() user: RequestUser,
  ) {
    if (user.roleName == 'student') {
      await this.quizzesService.authStudentHard({
        courseId: query.courseId,
        userId: user.userId,
      });
      return this.quizzesService.findManyForStudent(query);
    }
    await this.quizzesService.authInstructorHard({
      courseId: query.courseId,
      userId: user.userId,
    });
    return this.quizzesService.findManyForInstructor(query);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get a quiz by ID' })
  @ApiParam({ name: 'id', description: 'Quiz ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Return the specified quiz.' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async findOne(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (user.roleName == 'student') {
      const quiz = await this.quizzesService.findStudentOneWithAuth({
        quizId: id,
        userId: user.userId,
      });

      return quiz;
    }

    const quiz = await this.quizzesService.findInstructorOneWithAuth({
      quizId: id,
      userId: user.userId,
    });
    return quiz;
  }

  @Patch(':id')
  @RolesDecorator(Role.Teacher)
  @ApiOperation({ summary: 'Update a quiz by ID' })
  @ApiParam({ name: 'id', description: 'Quiz ID', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The quiz has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async update(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    // Authorize & validate data
    this.quizzesService.validateUpdateAuthDetails(
      await this.quizzesService.getUpdateAuthDetails(
        id,
        user.userId,
        updateQuizDto,
      ),
      updateQuizDto,
    );
    return this.quizzesService.update(id, updateQuizDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mark quiz as available or calculate it',
    description: `Mark the quiz as \`available\` for release or just calculate its grades.`,
  })
  @ApiParam({
    name: 'id',
    description: `The unique identifier of the quiz (\`quiz.id\`).`,
    type: Number,
    required: true,
    example: 23,
  })
  @ApiResponse({
    type: Boolean,
    status: HttpStatus.OK,
    description: `The quiz has been successfully marked as available or calculated.`,
  })
  @ApiResponse({
    type: UnauthorizedResponse,
    status: HttpStatus.UNAUTHORIZED,
    description: 'You must be a teacher of this quiz to edit it.',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Role.Teacher)
  @Patch(':id/mark-available')
  async markAsAvailable(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() markAvailableDto: MarkAvailableDto,
  ) {
    await this.quizzesService.authInstructorHardPerQuiz({
      quizId: id,
      userId: user.userId,
    });
    return this.quizzesService.markAsAvailable({
      quizId: id,
      auto: markAvailableDto.auto,
    });
  }

  @Delete(':id')
  @RolesDecorator(Role.Teacher)
  @ApiOperation({ summary: 'Delete a quiz by ID' })
  @ApiParam({ name: 'id', description: 'Quiz ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The quiz has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: RequestUser,
  ) {
    await this.quizzesService.authInstructorHardPerQuiz({
      quizId: id,
      userId: user.userId,
    });
    return this.quizzesService.remove(id);
  }
}
