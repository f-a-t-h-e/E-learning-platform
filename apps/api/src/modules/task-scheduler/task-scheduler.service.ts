import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ClientProxy } from '@nestjs/microservices';
import { clearTimeout, setTimeout } from 'timers';

import {
  EXTRA_GAP_IN_MS,
  FIXED_DATE_TO_START_FROM,
  TASK_SCHEDULE_KEY,
} from 'common/constants';
import { ScheduledTaskDetailsEntity } from 'common/entities/scheduled-task-details.entity';

@Injectable()
export class TaskSchedulerService implements OnModuleInit {
  private lastTimeout: NodeJS.Timeout | undefined;
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject('SERVICES_CLIENT') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    this.pollScheduler();
  }

  /**
   *
   * @param taskId Unique key for the task
   * @param channel The string that you will use in the `@EventPattern` decorator in the microservice
   * @param triggerTime Can be one of the following
   *
   * `Date` The date at which the event needs to be triggered.
   *
   * `string` A string in a valid date format.
   *
   * `number` The number of milliseconds of the date.
   *
   * @param data The data that you need to send in the event
   */
  async scheduleUniqueEvent({
    event,
    triggerTime,
    taskId,
  }: {
    event: ScheduledTaskDetailsEntity;
    triggerTime: Date | string | number;
    taskId: string;
  }) {
    if (await this.setKeyIfNotExist(taskId, event)) {
      await this.submitTask(taskId, triggerTime);
      return true;
    }
    return false;
  }

  async setKeyIfNotExist(taskId: string, data: any) {
    const key = this.getKeyFomTaskId(taskId);
    return !!(await this.redis.setnx(key, JSON.stringify(data)));
  }

  async submitTask(taskId: string, date: Date | string | number) {
    await this.redis.zadd(
      TASK_SCHEDULE_KEY,
      new Date(date).getTime() - FIXED_DATE_TO_START_FROM,
      taskId,
    );
    this.pollScheduler();
  }

  async pollScheduler() {
    clearTimeout(this.lastTimeout);
    // Phase 1
    // Do old tasks if any
    const oldData = await this.redis.zrangebyscore(
      TASK_SCHEDULE_KEY,
      '-inf',
      new Date().getTime() - FIXED_DATE_TO_START_FROM + EXTRA_GAP_IN_MS,
      'LIMIT',
      0,
      // get the oldest 10 events that need to be run
      10,
    );

    for (const taskId of oldData) {
      const key = this.getKeyFomTaskId(taskId);
      const [, detailsString] = await Promise.all([
        this.redis.zrem(TASK_SCHEDULE_KEY, taskId),
        this.redis.getdel(key),
      ]);
      const details = JSON.parse(detailsString) as ScheduledTaskDetailsEntity;

      if (
        details != null &&
        typeof details.channel == 'string' &&
        details.data
      ) {
        // @todo : Check .pipe(timeout(...))
        this.client.emit(details.channel, details.data);
      } else {
        console.log('failed to emit : ', details);
      }
    }
    // Re check for more old tasks
    if (oldData.length >= 10) {
      return await this.pollScheduler();
    }
    // Else proceed to phase 2

    // Phase 2
    // Get ready for the next task
    const upComingData = await this.redis.zrangebyscore(
      TASK_SCHEDULE_KEY,
      '-inf',
      '+inf',
      'WITHSCORES',
      'LIMIT',
      0,
      // Get the next event that needs to be run
      1,
    );
    if (!upComingData.length) {
      return;
    }

    const nextTimeoutDate = +upComingData[1] + FIXED_DATE_TO_START_FROM;
    // Make sure that you don't exceed 32-bit signed integer limit for nodejs timeout
    const nextTimeoutAfter = Math.min(
      nextTimeoutDate - new Date().getTime(),
      43200000,
    ); // maximum 12h : 1000 * 60 * 60 * 12

    this.lastTimeout = setTimeout(async () => {
      await this.pollScheduler();
    }, nextTimeoutAfter);
  }

  getKeyFomTaskId(taskId: string) {
    return `${TASK_SCHEDULE_KEY}:${taskId}`;
  }
}
