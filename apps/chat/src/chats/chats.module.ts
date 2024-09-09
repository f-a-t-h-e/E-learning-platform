import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatsController } from './chats.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  providers: [ChatsService],
  exports: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
