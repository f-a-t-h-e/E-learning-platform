import { Test, TestingModule } from '@nestjs/testing';
import { QuizReviewController } from './quiz-review.controller';
import { QuizReviewService } from './quiz-review.service';

describe('QuizReviewController', () => {
  let controller: QuizReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizReviewController],
      providers: [QuizReviewService],
    }).compile();

    controller = module.get<QuizReviewController>(QuizReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
