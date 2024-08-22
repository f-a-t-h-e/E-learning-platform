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
    await this.quizzesService.checkRefrencesHard(createQuizDto, user.userId);
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get many quizzes' })
  @ApiQuery({
    name: 'courseId',
    type: Number,
    description: `\`course.id\` that you want to get its quizzes.`,
  })
  @ApiResponse({ status: 200, description: 'Return many quizzes.' })
  findMany(@Query('courseId', ParseIntPipe) courseId: number) {
    return this.quizzesService.findByCourseId(courseId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get a quiz by ID' })
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  @ApiResponse({ status: 200, description: 'Return the specified quiz.' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async findOne(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const quiz = await this.quizzesService.findOne(id);
    if (user.roleName == 'student') {
      quiz.Questions.forEach((q) => {
        delete q.correctAnswer;
      });
    }
    return quiz;
  }

  @Patch(':id')
  @RolesDecorator(Role.Teacher)
  @ApiOperation({ summary: 'Update a quiz by ID' })
  @ApiParam({ name: 'id', description: 'Quiz ID', type: Number })
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
    await this.quizzesService.checkRefrencesHard(updateQuizDto, user.userId);
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
    await this.quizzesService.authHard({ quizId: id, userId: user.userId });
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.remove(id);
  }
}
