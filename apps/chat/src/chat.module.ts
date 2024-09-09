import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SessionService } from './session.service';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { JwtStrategy } from 'common/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({global: true}),
    ConfigModule.forRoot({ isGlobal: true }),
    // JwtModule.register({
    //   secret: 'topSecret21',
    //   signOptions: {
    //     expiresIn: 3600,
    //   },
    // }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return { uri: configService.get('MONGO_URI') };
      },
    }),
    ChatsModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [Gateway, SessionService, JwtStrategy],
})
export class ChatModule {}
