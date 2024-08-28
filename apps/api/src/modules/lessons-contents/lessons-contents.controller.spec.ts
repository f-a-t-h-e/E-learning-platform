import { Test, TestingModule } from '@nestjs/testing';
import { LessonsContentsController } from './lessons-contents.controller';
import { LessonsContentsService } from './lessons-contents.service';

describe('LessonsContentsController', () => {
  let controller: LessonsContentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsContentsController],
      providers: [LessonsContentsService],
    }).compile();

    controller = module.get<LessonsContentsController>(
      LessonsContentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
