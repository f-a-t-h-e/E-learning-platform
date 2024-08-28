import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class TaskSchedulerService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async scheduleTask(
    /**
     * The string that you will use in the `@EventPattern` decorator
     * in the microservice
     */
    event: string,
    /**
     * `Date` The date at which the event needs to be triggered.
     * 
     * `string` A string in a valid date format.
     * 
     * `number` The number of milliseconds of the date.
     */
    triggerTime: Date | string | number,
    /**
     * 
     */
    data: any,
  ) {
    const now = new Date().getTime();
    const triggerTimeMs = new Date(triggerTime).getTime();
    const delay = Math.ceil((triggerTimeMs - now) / 1000); // Convert to seconds

    const taskId = `task:${event}:${triggerTimeMs}`;

    // Store the task data in Redis
    await this.redis.set(taskId, JSON.stringify(data), 'EX', delay);

    // Lua script to publish the event when the key expires
    const luaScript = `
      local taskId = KEYS[1]
      local event = ARGV[1]
      local data = redis.call('GET', taskId)
      redis.call('PUBLISH', event, data)
      redis.call('DEL', taskId)
    `;

    // Schedule the Lua script to run after the delay
    await this.redis.eval(luaScript, 1, taskId, event, delay);
  }
}
