import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import JwtGuard from 'common/jwt.guard';
import { ChatsService } from './chats.service';
import { GetManyChatsQueryDto } from './dto/get-many-chats-query.dto';
import { User } from 'common/user.decorator';
import { RequestUser } from 'common/entities/request-user.entity';

@ApiTags('chats')
@Controller('chats')
@UseGuards(JwtGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
  @Get()
  async findAll(
    @Query() options: GetManyChatsQueryDto,
    @User() user: RequestUser,
  ) {
    const data = await this.chatsService.findAll(user.userId, options);
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
