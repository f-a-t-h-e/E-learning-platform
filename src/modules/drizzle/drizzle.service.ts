import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';
import * as tables from './schema/tables';

export type DatabasePGDrizzle = PostgresJsDatabase<typeof schema>;

@Injectable()
export class DrizzleService implements OnModuleInit {
  private readonly logger = new Logger(DrizzleService.name);
  db: PostgresJsDatabase<typeof schema>;
  readonly tables = tables;
  constructor(private readonly configService: ConfigService) {}
  async onModuleInit() {
    const connectionString = this.configService.get<string>('DATABASE_URL');
    const queryClient = postgres(connectionString);
    const logger =
      this.configService.get<string>('NODE_ENV') === 'development'
        ? (query: string, params: unknown[]) => {
            this.logger.log(`Query: ${query}`);
            this.logger.log(`Params: ${params}`);
          }
        : (..._: [string, unknown[]]) => {
            _;
          };
    this.db = drizzle(queryClient, {
      schema: schema,
      logger: {
        logQuery: logger,
      },
    });
  }
}
