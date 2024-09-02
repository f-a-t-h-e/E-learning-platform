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
  NotFoundException,
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
import { ApiErrorResponses } from '../../common/decorators/api-error-responses.decorator';
import { RolesDecorator } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from '../../common/decorators/user.decorator';
import { RequestUser } from '../auth/entities/request-user.entity';

@ApiBearerAuth()
@ApiErrorResponses()
@ApiTags('Quiz Questions')
@Controller('quiz-questions')
export class QuizQuestionsController {
  constructor(private readonly quizQuestionsService: QuizQuestionsService) {}

  // @Post()
  // @RolesDecorator(Role.Teacher)
  // @ApiOperation({ summary: 'Create a new quiz question' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'The quiz question has been successfully created.',
  // })
  // create(@Body() createQuizQuestionDto: CreateQuizQuestionDto) {
  //   return this.quizQuestionsService.create(createQuizQuestionDto);
  // }

  // @Post('bulk')
  // @RolesDecorator(Role.Teacher)
  // @ApiOperation({ summary: 'Create multiple quiz questions' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'The quiz questions have been successfully created.',
  // })
  // createMany(@Body() createQuizQuestionsDto: CreateQuizQuestionDto[]) {
  //   return this.quizQuestionsService.createMany(createQuizQuestionsDto);
  // }

  // @Get()
  // @UseGuards(JwtGuard)
  // @ApiOperation({ summary: 'Get all quiz questions' })
  // @ApiQuery({
  //   name: 'courseId',
  //   type: Number,
  //   description: `\`course.id\` that you want to get its quizzes questions.`,
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Return all the course quiz questions.',
  // })
  // findAll(@Query('courseId', ParseIntPipe) courseId: number) {
  //   return this.quizQuestionsService.findAll(courseId);
  // }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get a quiz question by ID' })
  @ApiParam({ name: 'id', description: 'Quiz Question ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return the specified quiz question.',
  })
  @ApiResponse({ status: 404, description: 'Quiz question not found' })
  async findOne(@Param('id', ParseIntPipe) id: number, @User() user: RequestUser) {
    if (user.roleName == "student") {
      const details = await this.quizQuestionsService.findOneForStudent(id, user.userId);
      if (!details.found) {
        throw new NotFoundException(`This question doesn't exist`)
      }
      this.quizQuestionsService.validateFindOneForStudent(details.data);
      return {
        question: details.question,
        studentAnswer: details.studentAnswer,
      }
    }
  }

  // @Patch(':id')
  // @RolesDecorator(Role.Teacher)
  // @ApiOperation({ summary: 'Update a quiz question by ID' })
  // @ApiParam({ name: 'id', description: 'Quiz Question ID', type: Number })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The quiz question has been successfully updated.',
  // })
  // @ApiResponse({ status: 404, description: 'Quiz question not found' })
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateQuizQuestionDto: UpdateQuizQuestionDto,
  // ) {
  //   return this.quizQuestionsService.update(id, updateQuizQuestionDto);
  // }

  // @Delete(':id')
  // @RolesDecorator(Role.Teacher)
  // @ApiOperation({ summary: 'Delete a quiz question by ID' })
  // @ApiParam({ name: 'id', description: 'Quiz Question ID', type: Number })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The quiz question has been successfully deleted.',
  // })
  // @ApiResponse({ status: 404, description: 'Quiz question not found' })
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.quizQuestionsService.remove(id);
  // }

  // @Delete('bulk/:id')
  // @ApiParam({ name: 'id', description: 'Quiz Question ID', type: Number })
  // @RolesDecorator(Role.Teacher)
  // @ApiOperation({ summary: 'Delete multiple quiz questions by IDs' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The quiz questions have been successfully deleted.',
  // })
  // removeMany(@Param('id', ParseIntPipe) id: number) {
  //   return this.quizQuestionsService.removeMany(id);
  // }
}
