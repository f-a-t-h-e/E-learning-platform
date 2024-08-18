import { Test, TestingModule } from '@nestjs/testing';
import { QuizSubmissionsController } from './quiz-submissions.controller';
import { QuizSubmissionsService } from './quiz-submissions.service';

describe('QuizSubmissionsController', () => {
  let controller: QuizSubmissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizSubmissionsController],
      providers: [QuizSubmissionsService],
    }).compile();

    controller = module.get<QuizSubmissionsController>(QuizSubmissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
