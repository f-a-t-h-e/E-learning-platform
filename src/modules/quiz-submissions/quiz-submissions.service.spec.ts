import { Test, TestingModule } from '@nestjs/testing';
import { QuizSubmissionsService } from './quiz-submissions.service';

describe('QuizSubmissionsService', () => {
  let service: QuizSubmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizSubmissionsService],
    }).compile();

    service = module.get<QuizSubmissionsService>(QuizSubmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
