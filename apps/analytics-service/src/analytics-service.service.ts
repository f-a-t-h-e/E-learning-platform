import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
