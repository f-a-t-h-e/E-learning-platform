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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { QuizQuestionsService } from './quiz-questions.service';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import JwtGuard from '../auth/guards/jwt.guard';

@ApiBearerAuth()
@ApiErrorResponses()
@ApiTags('Quiz Questions')
@Controller('quiz-questions')
export class QuizQuestionsController {
  constructor(private readonly quizQuestionsService: QuizQuestionsService) {}

  @Post()
  @RolesDecorator(Role.Teacher)
  @ApiOperation({ summary: 'Create a new quiz question' })
  @ApiResponse({
    status: 201,
    description: 'The quiz question has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createQuizQuestionDto: CreateQuizQuestionDto) {
    return this.quizQuestionsService.create(createQuizQuestionDto);
  }

  @Post('bulk')
  @RolesDecorator(Role.Teacher)
  @ApiOperation({ summary: 'Create multiple quiz questions' })
  @ApiResponse({
    status: 201,
    description: 'The quiz questions have been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  createMany(@Body() createQuizQuestionsDto: CreateQuizQuestionDto[]) {
    return this.quizQuestionsService.createMany(createQuizQuestionsDto);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get all quiz questions' })
  @ApiQuery({
    name: 'courseId',
    type: Number,
    description: `\`course.id\` that you want to get its quizzes questions.`
  })
  @ApiResponse({ status: 200, description: 'Return all the course quiz questions.' })
  findAll(@Query('courseId', ParseIntPipe) courseId: number) {
    return this.quizQuestionsService.findAll(courseId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get a quiz question by ID' })
  @ApiParam({ name: 'id', description: 'Quiz Question ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the specified quiz question.',
  })
  @ApiResponse({ status: 404, description: 'Quiz question not found' })
  findOne(@Param('id') id: string) {
    return this.quizQuestionsService.findOne(+id);
  }

  @Patch(':id')
  @RolesDecorator(Role.Teacher)
  @ApiOperation({ summary: 'Update a quiz question by ID' })
  @ApiParam({ name: 'id', description: 'Quiz Question ID' })
  @ApiResponse({
    status: 200,
    description: 'The quiz question has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Quiz question not found' })
  update(
    @Param('id') id: string,
    @Body() updateQuizQuestionDto: UpdateQuizQuestionDto,
  ) {
    return this.quizQuestionsService.update(+id, updateQuizQuestionDto);
  }

  @Delete(':id')
  @RolesDecorator(Role.Teacher)
  @ApiOperation({ summary: 'Delete a quiz question by ID' })
  @ApiParam({ name: 'id', description: 'Quiz Question ID' })
  @ApiResponse({
    status: 200,
    description: 'The quiz question has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Quiz question not found' })
  remove(@Param('id') id: string) {
    return this.quizQuestionsService.remove(+id);
  }

  @Delete('bulk')
  @RolesDecorator(Role.Teacher)
  @ApiOperation({ summary: 'Delete multiple quiz questions by IDs' })
  @ApiResponse({
    status: 200,
    description: 'The quiz questions have been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  removeMany(@Body() ids: number[]) {
    return this.quizQuestionsService.removeMany(ids);
  }
}
