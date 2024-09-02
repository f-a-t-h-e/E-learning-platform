import { Module } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  // ClientsModule,
  Transport,
} from '@nestjs/microservices';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          options: {
            host: configService.get('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
          type: 'single',
        };
      },
    }),
    // ClientsModule.registerAsync({
    //   clients: [
    //     {
    //       inject: [ConfigService],
    //       useFactory: (configService: ConfigService) => {

    //         return {
    //           // name: 'SERVICES_CLIENT',
    //           // transport: Transport.REDIS,
    //           // options: {
    //           //   host: ConfigService.get('REDIS_HOST'),
    //           //   port: ConfigService.get<number>('REDIS_PORT'),
    //           // },
    //           customClass:
    //         },
    //       },
    //     },
    //   ],
    // }),
  ],
  providers: [
    {
      provide: 'SERVICES_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          options: {
            host: configService.get('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
          transport: Transport.REDIS,
        });
      },
    },
    TaskSchedulerService,
  ],
  exports: [TaskSchedulerService],
})
export class TaskSchedulerModule {}
