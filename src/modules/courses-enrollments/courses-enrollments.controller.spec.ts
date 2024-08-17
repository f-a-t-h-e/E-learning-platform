import { Test, TestingModule } from '@nestjs/testing';
import { CoursesEnrollmentsController } from './courses-enrollments.controller';
import { CoursesEnrollmentsService } from './courses-enrollments.service';

describe('CoursesEnrollmentsController', () => {
  let controller: CoursesEnrollmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesEnrollmentsController],
      providers: [CoursesEnrollmentsService],
    }).compile();

    controller = module.get<CoursesEnrollmentsController>(CoursesEnrollmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
