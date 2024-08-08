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
  ParseIntPipe,
} from '@nestjs/common';
import { LessonsContentsService } from './lessons-contents.service';
import { CreateLessonsContentDto } from './dto/create-lessons-content.dto';
import { UpdateLessonsContentDto } from './dto/update-lessons-content.dto';
import { LessonsService } from '../lessons/lessons.service';
import JwtGuard from '../auth/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('lessons-contents')
export class LessonsContentsController {
  constructor(
    private readonly lessonsContentsService: LessonsContentsService,
    private readonly lessonsService: LessonsService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @User() user: RequestUser,
    @Body() createLessonsContentDto: CreateLessonsContentDto,
  ) {
    if (
      !this.lessonsService.canUserEditLesson(
        user.id,
        createLessonsContentDto.id,
      )
    ) {
      throw new BadRequestException(
        'You have to be a teacher in this course to edit a lesson',
      );
    }
    /**
     * @todo Check the content size to determine if you should save it as a file or as a string in the db
     */
    return this.lessonsContentsService.create(createLessonsContentDto, 'TEXT');
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsContentsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @User() user: RequestUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonsContentDto: UpdateLessonsContentDto,
  ) {
    if (!this.lessonsService.canUserEditLesson(user.id, id)) {
      throw new BadRequestException(
        'You have to be a teacher in this course to edit a lesson',
      );
    }
    /**
     * @todo Check the content size to determine if you should save it as a file or as a string in the db
     */
    return this.lessonsContentsService.update(id, updateLessonsContentDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@User() user: RequestUser, @Param('id', ParseIntPipe) id: number) {
    if (!this.lessonsService.canUserEditLesson(user.id, id)) {
      throw new BadRequestException(
        'You have to be a teacher in this course to edit a lesson',
      );
    }
    return this.lessonsContentsService.remove(id);
  }
}
