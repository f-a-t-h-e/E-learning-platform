import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { QuizSubmissionsService } from './quiz-submissions.service';
import { CreateQuizSubmissionDto } from './dto/create-quiz-submission.dto';
import { UpdateQuizSubmissionDto } from './dto/update-quiz-submission.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import JwtGuard from '../auth/guards/jwt.guard';

@ApiBearerAuth()
@ApiErrorResponses()
@ApiTags('Quiz Submissions')
@Controller('quiz-submissions')
export class QuizSubmissionsController {
  constructor(
    private readonly quizSubmissionsService: QuizSubmissionsService,
  ) {}

  @Post()
  @RolesDecorator(Role.Student)
  @ApiOperation({ summary: 'Create a new quiz submission' })
  @ApiResponse({
    status: 201,
    description: 'Quiz submission successfully created.',
  })
  create(@Body() createQuizSubmissionDto: CreateQuizSubmissionDto) {
    return this.quizSubmissionsService.create(createQuizSubmissionDto);
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Retrieve all quiz submissions' })
  @ApiQuery({
    name: 'courseId',
    type: Number,
    description: `\`course.id\` that you want to get its submissions.`,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quiz submissions.',
  })
  findAll(@Query('courseId', ParseIntPipe) courseId: number) {
    return this.quizSubmissionsService.findAll(courseId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Retrieve a specific quiz submission by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the quiz submission to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the quiz submission.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quizSubmissionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update a specific quiz submission by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the quiz submission to update',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Quiz submission successfully updated.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizSubmissionDto: UpdateQuizSubmissionDto,
  ) {
    return this.quizSubmissionsService.update(id, updateQuizSubmissionDto);
  }

  @Delete(':id')
  @RolesDecorator(Role.Student)
  @ApiOperation({ summary: 'Delete a specific quiz submission by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the quiz submission to delete',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Quiz submission successfully deleted.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizSubmissionsService.remove(id);
  }
}
