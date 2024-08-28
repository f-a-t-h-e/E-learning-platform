import { Controller, Get } from '@nestjs/common';
import { AnalyticsServiceService } from './analytics-service.service';

@Controller()
export class AnalyticsServiceController {
  constructor(private readonly analyticsServiceService: AnalyticsServiceService) {}

  @Get()
  getHello(): string {
    return this.analyticsServiceService.getHello();
  }
}
