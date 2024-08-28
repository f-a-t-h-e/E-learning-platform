import { Test, TestingModule } from '@nestjs/testing';
import { TaskSchedulerService } from './task-scheduler.service';

describe('TaskSchedulerService', () => {
  let service: TaskSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskSchedulerService],
    }).compile();

    service = module.get<TaskSchedulerService>(TaskSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
