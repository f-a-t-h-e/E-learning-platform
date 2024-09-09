import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, TChat } from './schemas/chat.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { GetManyChatsQueryDto } from './dto/get-many-chats-query.dto';

type BaseReturn<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; error: any } };

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async create(createChatDto: Partial<TChat>): Promise<BaseReturn<Chat>> {
    const createdChat = new this.chatModel(createChatDto);
    return {
      success: true as true,
      data: await createdChat.save(),
    };
  }

  async findAll(
    userId: number,
    options: GetManyChatsQueryDto,
  ): Promise<BaseReturn<{ data: Chat[]; hasMore: boolean }>> {
    const { chatCursor, chatPageSize = 10, chatSkip = 0 } = options;

    // Define the query
    const query: RootFilterQuery<Chat> = {
      $or: [{ sender: userId }, { recipient: userId }],
    };

    // Apply chatCursor if provided (fetch chats after the given cursor)
    if (chatCursor) {
      if (chatPageSize > 0) {
        query['lastUpdate'] = { $lt: chatCursor };
      } else {
        query['lastUpdate'] = { $gt: chatCursor };
      }
    }

    // Fetch the chats with pagination
    const chats = await this.chatModel
      .find(query)
      .sort([
        ['lastUpdate', -1],
        ['createdAt', -1],
      ])
      .skip(chatSkip)
      .limit(Math.abs(chatPageSize) + 1)
      .lean()
      .exec();
    let hasMore = false;
    if (chats.length > Math.abs(chatPageSize)) {
      hasMore = true;
      chats.pop();
    }
    return {
      success: true,
      data: {
        data: chats,
        hasMore: hasMore,
      },
    };
  }

  async findOne(id: string): Promise<BaseReturn<TChat>> {
    const chat = (await this.chatModel
      .findById(id)
      .lean()
      .exec()) as unknown as TChat;
    if (!chat) {
      return {
        success: false,
        error: {
          message: `Chat with id ${id} not found`,
          error: null,
        },
      };
    }
    return {
      success: true,
      data: chat,
    };
  }

  async updateLastMessageDate(chatId: string) {
    await this.chatModel.updateOne({ _id: chatId }, { lastUpdate: new Date() });
  }

  async update(
    id: string,
    updateChatDto: Partial<TChat>,
  ): Promise<BaseReturn<Chat>> {
    const updatedChat = await this.chatModel
      .findByIdAndUpdate(id, updateChatDto, { new: true })
      .exec();
    if (!updatedChat) {
      return {
        success: false,
        error: {
          message: `Chat with id ${id} not found`,
          error: null,
        },
      };
    }

    return {
      success: true,
      data: updatedChat,
    };
  }

  async archive(id: string, userId: number): Promise<BaseReturn<true>> {
    const archivedChat = await this.chatModel
      .updateOne(
        { _id: id, $or: [{ sender: userId }, { recipient: userId }] },
        { $set: { isArchivedBy: userId } },
      )
      .exec();

    if (!archivedChat.matchedCount) {
      return {
        success: false,
        error: {
          message: `Chat with id ${id} not found`,
          error: null,
        },
      };
    }
    return {
      success: true,
      data: true,
    };
  }
}
