import { Test, TestingModule } from '@nestjs/testing';
import { CoursesEnrollmentsService } from './courses-enrollments.service';

describe('CoursesEnrollmentsService', () => {
  let service: CoursesEnrollmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesEnrollmentsService],
    }).compile();

    service = module.get<CoursesEnrollmentsService>(CoursesEnrollmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
