import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './modules/prisma/prisma.module';

@Global()
@Module({
  imports: [JwtModule.register({}), PrismaModule],
  exports: [JwtModule, PrismaModule],
})
export class GlobalModulesWrapper {}
