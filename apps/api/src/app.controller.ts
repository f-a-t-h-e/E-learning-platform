import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
// import { PrismaService } from './modules/prisma/prisma.service';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private readonly prisma: PrismaService
  ) {}

  @Get()
  async getHello() {
    // return this.prisma.$queryRaw`SELECT update_student_grades_and_progress(1)`
    return this.appService.getHello();
  }
}
