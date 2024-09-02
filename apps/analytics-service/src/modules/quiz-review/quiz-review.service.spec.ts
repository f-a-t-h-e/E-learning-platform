import { Test, TestingModule } from '@nestjs/testing';
import { QuizReviewService } from './quiz-review.service';

describe('QuizReviewService', () => {
  let service: QuizReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizReviewService],
    }).compile();

    service = module.get<QuizReviewService>(QuizReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
