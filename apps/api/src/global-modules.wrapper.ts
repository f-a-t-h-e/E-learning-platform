import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './modules/prisma/prisma.module';
import { DrizzleModule } from './modules/drizzle/drizzle.module';
// import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
// import { QUIZZES_QUEUE } from './common/providers-constants';
import { TaskSchedulerModule } from './modules/task-scheduler/task-scheduler.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({}),
    PrismaModule,
    DrizzleModule,
    TaskSchedulerModule,
    // BullModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     connection: {
    //       host: configService.get('REDIS_HOST'),
    //       port: configService.get('REDIS_PORT'),
    //     },
    //   }),
    // }),
    // BullModule.registerQueue({
    //   name: QUIZZES_QUEUE,
    // }),
  ],
  exports: [
    ConfigModule,
    JwtModule,
    PrismaModule,
    DrizzleModule,
    // BullModule,
    TaskSchedulerModule,
  ],
})
export class GlobalModulesWrapper {}
