import { Module } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => {
        return {
          options: {
            host: ConfigService.get('REDIS_HOST'),
            port: ConfigService.get('REDIS_PORT'),
          },
          type: 'single',
        };
      },
    }),
  ],
  providers: [TaskSchedulerService],
  exports: [TaskSchedulerService],
})
export class TaskSchedulerModule {}
