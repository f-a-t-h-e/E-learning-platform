import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, TMessage } from './schemas/message.schema';
import { FlattenMaps, Model, RootFilterQuery, Types } from 'mongoose';
import { AddReactionDto, GetManyMessagesQueryDto } from './dto';

type BaseReturn<T> = Promise<
  | { success: true; data: T }
  | { success: false; error: { message: string; error: any } }
>;

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async getMessage(messageId: string): BaseReturn<
    FlattenMaps<Message> &
      Required<{
        _id: FlattenMaps<unknown>;
      }>
  > {
    return {
      success: true,
      data: await this.messageModel
        .findOne({ _id: messageId })
        .select('-usersReactions') // Avoid retrieving large user reaction maps
        .lean()
        .exec(),
    };
  }

  // Send a new message
  async sendMessage(sendMessageDto: Partial<TMessage>): BaseReturn<Message> {
    const createdMessage = new this.messageModel(sendMessageDto);
    return {
      success: true,
      data: await createdMessage.save(),
    };
  }

  async findMessagesByChat(
    chatId: Types.ObjectId | string,
    options: GetManyMessagesQueryDto,
  ): Promise<BaseReturn<{ data: TMessage[]; hasMore: boolean }>> {
    const { messageCursor, messagePageSize = 10, messageSkip = 0 } = options;

    // Define the query
    const query: RootFilterQuery<Message> = {
      chatId: chatId,
    };
    // Apply messageCursor if provided (fetch messages after the given cursor)
    if (messageCursor) {
      if (messagePageSize > 0) {
        query['createdAt'] = { $lt: messageCursor };
      } else {
        query['createdAt'] = { $gt: messageCursor };
      }
    }

    // Fetch the messages with pagination
    const messages = await this.messageModel
      .find(query)
      .select('-usersReactions')
      .sort({ createdAt: -1 }) // Sort descending
      .skip(messageSkip)
      .limit(Math.abs(messagePageSize) + 1) // Apply limit as per messagePageSize
      .lean()
      .exec();
    let hasMore = false;
    if (messages.length > Math.abs(messagePageSize)) {
      hasMore = true;
      messages.pop();
    }
    return {
      success: true,
      data: {
        data: messages as unknown as TMessage[],
        hasMore: hasMore,
      },
    };
  }

  // // Query messages by chatId, ordered by createdAt
  // async findMessagesByChat(chatId: string): BaseReturn<
  //   (FlattenMaps<Message> &
  //     Required<{
  //       _id: FlattenMaps<unknown>;
  //     }>)[]
  // > {
  //   return {
  //     success: true,
  //     data: await this.messageModel
  //       .find({ chatId })
  //       .sort({ createdAt: 1 })
  //       .select('-usersReactions') // Avoid retrieving large user reaction maps
  //       .lean()
  //       .exec(),
  //   };
  // }

  // Add or update reaction for a message
  async addReaction(
    addReactionDto: AddReactionDto,
    userId: number,
  ): BaseReturn<boolean> {
    const { messageId, reaction } = addReactionDto;

    const update = {
      $inc: {
        [`reactions.${reaction}`]: 1, // Increment reaction count
      },
      $set: {
        [`usersReactions.${userId}`]: reaction, // Set user's reaction
      },
    };

    const message = await this.messageModel
      .findOneAndUpdate(
        { _id: messageId, [`usersReactions.${userId}`]: { $ne: reaction } }, // Only update if not same reaction
        update,
        { new: true },
      )
      .select('reactions')
      .lean()
      .exec();

    if (!message) {
      // If same reaction, decrement and remove user from the map
      await this.messageModel.updateOne(
        { _id: messageId, [`usersReactions.${userId}`]: reaction },
        {
          $inc: { [`reactions.${reaction}`]: -1 },
          $unset: { [`usersReactions.${userId}`]: '' },
        },
      );
      return {
        success: true,
        data: false,
      };
    }
    return {
      success: true,
      data: true,
    };
  }

  // Fetch only reactions for a message (minimal data retrieval)
  async findReactionsByMessage(messageId: string): BaseReturn<{
    reactions: Record<string, number>;
    usersReactions: Record<string, string>;
  }> {
    const message = await this.messageModel
      .findById(messageId)
      .select('usersReactions reactions')
      .lean()
      .exec();

    if (!message) {
      return {
        success: false,
        error: {
          message: 'Message not found',
          error: null,
        },
      };
    }

    return {
      success: true,
      data: {
        reactions: message.reactions,
        usersReactions: message.usersReactions,
      },
    };
  }
}
