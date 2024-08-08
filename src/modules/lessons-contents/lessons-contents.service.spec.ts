import { Test, TestingModule } from '@nestjs/testing';
import { LessonsContentsService } from './lessons-contents.service';

describe('LessonsContentsService', () => {
  let service: LessonsContentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonsContentsService],
    }).compile();

    service = module.get<LessonsContentsService>(LessonsContentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
