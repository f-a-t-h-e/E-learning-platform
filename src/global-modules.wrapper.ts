import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './modules/prisma/prisma.module';
import { DrizzleModule } from './modules/drizzle/drizzle.module';

@Global()
@Module({
  imports: [JwtModule.register({}), PrismaModule, DrizzleModule],
  exports: [JwtModule, PrismaModule, DrizzleModule],
})
export class GlobalModulesWrapper {}
