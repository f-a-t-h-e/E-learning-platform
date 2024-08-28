import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsServiceController } from './analytics-service.controller';
import { AnalyticsServiceService } from './analytics-service.service';

describe('AnalyticsServiceController', () => {
  let analyticsServiceController: AnalyticsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsServiceController],
      providers: [AnalyticsServiceService],
    }).compile();

    analyticsServiceController = app.get<AnalyticsServiceController>(AnalyticsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(analyticsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
