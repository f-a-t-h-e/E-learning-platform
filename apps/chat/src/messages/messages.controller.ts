import {
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { GetManyMessagesQueryDto } from './dto';
import JwtGuard from 'common/jwt.guard';
import { ChatsService } from '../chats/chats.service';
import { RequestUser } from 'common/entities/request-user.entity';
import { User } from 'common/user.decorator';

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly chatsService: ChatsService,
  ) {}

  @Get(':chatId')
  @ApiParam({
    name: 'chatId',
    description: 'The ID of the chat',
    type: 'string',
  })
  async findAll(
    @Param('chatId') chatId: string,
    @Query() options: GetManyMessagesQueryDto,
    @User() user: RequestUser,
  ) {
    const chat = await this.chatsService.findOne(chatId);
    if (!chat) {
      throw new NotFoundException(`This chat doesn't exist`);
    }
    if (chat.success == false) {
      throw new InternalServerErrorException();
    }
    if (
      chat.data.sender !== user.userId &&
      chat.data.recipient !== user.userId
    ) {
      throw new ForbiddenException();
    }
    const data = await this.messagesService.findMessagesByChat(chat.data._id, options);
    if (data.success == false) {
      return {
        success: false,
      };
    }
    return {
      success: true,
      data: data.data.data,
      hasMore: data.data.hasMore,
    };
  }
}
