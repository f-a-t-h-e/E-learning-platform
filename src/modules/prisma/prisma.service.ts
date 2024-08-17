import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/library';

const MAX_RETRIES = 5;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
      ],
    });

    this.$on('query' as never, (e: Prisma.QueryEvent) => {
      this.logger.log(`Query: ${e.query}`);
      this.logger.log(`Params: ${e.params}`);
      this.logger.log(`Duration: ${e.duration}ms`);
    });

    this.$on('info' as never, (e: Prisma.LogEvent) => {
      this.logger.log(`Info: ${e.message}`);
    });

    this.$on('warn' as never, (e: Prisma.LogEvent) => {
      this.logger.warn(`Warning: ${e.message}`);
    });

    this.$on('error' as never, (e: Prisma.LogEvent) => {
      this.logger.error(`Error: ${e.message}`);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async useTransaction<R>(
    fn: (prisma: Omit<PrismaClient, ITXClientDenyList>) => Promise<R>,
  ): Promise<
    | {
        success: true;
        data: R;
      }
    | {
        success: false;
        error: any;
      }
  > {
    try {
      let retries = 0;

      let result: R | undefined = undefined;
      while (retries < MAX_RETRIES) {
        try {
          result = await this.$transaction(fn, {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          });
          break;
        } catch (error: any) {
          if (error.code === 'P2034') {
            retries++;
            continue;
          }
          throw error;
        }
      }
      if (typeof result === 'undefined') {
        throw new Error(
          `Something went wrong, make sure that you passed correct Type`,
        );
      }
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}
