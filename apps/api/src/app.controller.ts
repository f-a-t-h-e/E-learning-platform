import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
// import { TaskSchedulerService } from './modules/task-scheduler/task-scheduler.service';
// import { Channels_Enum } from '../../../common/enums/channels.enum';
// import { PrismaService } from './modules/prisma/prisma.service';

@ApiTags('root')
@Controller()
export class AppController {
  id: number = 1;
  constructor(
    private readonly appService: AppService,
    // private readonly prisma: PrismaService
    // private readonly taskSchedulerService: TaskSchedulerService,
  ) {}

  @Get()
  async getHello() {
    // @Query('manual') manual?: "1", // @Query('date') date: string, // @Query('event') event: Channels_Enum, // @Query('taskid') taskId: string,
    // try {
    //   const details = manual == '1'
    //     ? {
    //         taskId,
    //         event,
    //         date: +date,
    //       }
    //     : {
    //         event: 'review_quiz' as Channels_Enum,
    //         date: new Date().getTime() + 1000 * 10,
    //         taskId: `${++this.id}`,
    //       };
    //   console.log(manual == '1' ? 'manual' : 'auto');

    //   const result = await this.taskSchedulerService.scheduleUniqueEvent(
    //     details.taskId,
    //     details.event,
    //     details.date,
    //     {
    //       event: 'do 1',
    //       data: {
    //         value1: 'Hii',
    //       },
    //     },
    //   );
    //   console.log(result);

    //   return result;
    // } catch (error) {
    //   return 'error';
    // }
    // // return this.prisma.$queryRaw`SELECT update_student_grades_and_progress(1)`

    return this.appService.getHello();
  }

  // @Get('l')
  // async long() {
  //   await new Promise((r) => setTimeout(r, 1000 * 10));
  //   return 'OK';
  // }
}
