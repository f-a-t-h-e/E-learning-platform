import { Global, Module } from '@nestjs/common';
import { DRIZZLE } from '../../common/providers-constants';
import { DrizzleService } from './drizzle.service';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useClass: DrizzleService,
    },
  ],
  exports: [
    {
      provide: DRIZZLE,
      useClass: DrizzleService,
    },
  ],
})
export class DrizzleModule {}
