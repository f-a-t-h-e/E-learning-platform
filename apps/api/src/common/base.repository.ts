import { Injectable, Logger } from '@nestjs/common';
import chalk from 'chalk';

@Injectable()
export class BaseRepository {
  private readonly logger: Logger;
  constructor(methodsToMonitor: string[], repo = BaseRepository as any) {
    this.logger = new Logger(repo.name);
    if (process.env['NODE_ENV'] === 'development') {
      for (const key of methodsToMonitor) {
        if (typeof this[key] == 'function') {
          this[`__${key}_placeholder`] = this[key];
          if (
            this[`__${key}_placeholder`].constructor.name == 'AsyncFunction'
          ) {
            // @ts-expect-error
            this[key] = async (...args: unknown) => {
              const startTime = performance.now();
              // @ts-expect-error
              const result = await this[`__${key}_placeholder`](...args);
              const endTime = performance.now();
              const totalTime = endTime - startTime;
              const floored = Math.floor(totalTime);
              this.logger.log(chalk.yellow(`async +${floored}ms`));
              return result;
            };
          } else {
            // @ts-expect-error
            this[key] = (...args: unknown) => {
              const startTime = performance.now();
              // @ts-expect-error
              const result = this[`__${key}_placeholder`](...args);
              const endTime = performance.now();
              const totalTime = endTime - startTime;
              const floored = Math.floor(totalTime);
              this.logger.log(chalk.yellow(`none async +${floored}ms`));
              return result;
            };
          }
        }
      }
    }
  }
}
