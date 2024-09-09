import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SessionService } from './session.service';
import { SOCKET_MESSAGES } from './common/constants';
import { SendMessageDto } from './messages/dto/send-message.dto';
import { MessagesService } from './messages/messages.service';
import { AddReactionDto } from './messages/dto';
import { RequestChatDto } from './chats/dto/request-chat.dto';
import { ChatsService } from './chats/chats.service';
import { isMongoId } from 'class-validator';

/**
 * server.emit(<event-name>, ...args[]) will send a message to everyone listening to this event
 *
 * client.emit(<event-name>, ...args[]) will send a message to the client that sent the current event being handled
 *
 * server.to(<room-name>).emit(<event-name>, ...args[]) will send a message to everyone in the room
 *
 * client.to(<room-name>).emit(<event-name>, ...args[]) will send a message to everyone in the room but not the current client being handled
 */

@WebSocketGateway()
// @UseGuards(WsAuthGuard)
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly sessionService: SessionService,
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    // console.log({server});
  }

  async handleConnection(client: Socket, ...args: any[]) {
    await this.sessionService.addClient(client);
  }

  async handleDisconnect(client: any) {
    await this.sessionService.removeClient(client);
  }

  // Handle requesting to chat
  @SubscribeMessage(SOCKET_MESSAGES.requestChat)
  async handleRequestingChat(client: Socket, payload: RequestChatDto) {
    const authResult = this.sessionService.authClient(client);
    if (authResult == false || payload.userId == authResult) {
      return;
    }
    const newChat = await this.chatsService.create({
      purpose: payload.purpose,
      sender: authResult,
      recipient: payload.userId,
    });
    if (newChat.success == false) {
      return { event: 'error', data: "Couldn't request the chat" };
    }
    const clients = this.sessionService.getClientIds(payload.userId);
    if (clients) {
      this.server.to(clients).emit(SOCKET_MESSAGES.requestChat, newChat.data);
    }
    return { event: SOCKET_MESSAGES.requestChat, data: newChat.data };
  }

  // Handle accepting a chat request
  @SubscribeMessage(SOCKET_MESSAGES.acceptChatRequest)
  async handleAcceptChatRequest(client: Socket, payload: string) {
    const authResult = this.sessionService.authClient(client);
    if (authResult == false || !isMongoId(payload)) {
      return;
    }
    const chat = await this.chatsService.findOne(payload);
    if (chat.success == false) {
      return { event: 'error', data: chat.error.message };
    }
    if (chat.data.recipient !== authResult) {
      return { event: 'error', data: `Forbidden` };
    }
    if (typeof chat.data.isArchivedBy === 'number') {
      return;
    }
    if (chat.data.acceptedAt) {
      return {
        event: SOCKET_MESSAGES.acceptChatRequest,
        data: chat,
      };
    }

    const clients = this.sessionService.getClientIds(chat.data.sender);
    if (clients) {
      this.server
        .to(clients)
        .emit(SOCKET_MESSAGES.acceptChatRequest, chat.data);
    }
    return { event: SOCKET_MESSAGES.acceptChatRequest, data: chat.data };
  }

  // Handle joining chat room
  @SubscribeMessage(SOCKET_MESSAGES.requestChat)
  async handleJoiningChatRoom(client: Socket, payload: string) {
    const authResult = this.sessionService.authClient(client);

    if (authResult == false || !isMongoId(payload)) {
      return;
    }
    const chat = await this.chatsService.findOne(payload);
    if (chat.success == false) {
      return { event: 'error', data: chat.error.message };
    }
    if (chat.data.sender !== authResult && chat.data.recipient !== authResult) {
      return { event: 'error', data: `Forbidden` };
    }
    if (!chat.data.acceptedAt) {
      return;
    }
    if (typeof chat.data.isArchivedBy === 'number') {
      return;
    }
    const chatRoom = `chat-${chat.data._id}`;
    client.join(chatRoom);
    client.to(chatRoom).emit(SOCKET_MESSAGES.joinChat, {
      chatId: payload,
      userId: authResult,
    });
    return;
  }

  // Handle sending a message
  @SubscribeMessage(SOCKET_MESSAGES.messageChat)
  async handleMessage(client: Socket, payload: SendMessageDto) {
    const authResult = this.sessionService.authClient(client);
    if (authResult == false) {
      return;
    }
    const chatRoom = `chat-${payload.chatId}`;
    if (!client.rooms.has(chatRoom)) {
      return {
        event: 'error',
        data: {
          error: 'Forbidden',
          message: 'You are not in this chat',
          chatId: payload.chatId,
        },
      };
    }
    const replyMessage = payload.replyToMessageId
      ? await this.messagesService.getMessage(payload.replyToMessageId)
      : null;
    if (replyMessage && replyMessage.success == false) {
      return {
        event: 'error',
        data: { message: 'Failed to get the message you are replying to' },
      };
    }
    const message = await this.messagesService.sendMessage({
      author: authResult,
      chatId: payload.chatId,
      replyTo: payload.replyToMessageId
        ? {
            messageId: payload.replyToMessageId,
            authorId: (replyMessage as typeof replyMessage & { success: true })
              .data.author,
          }
        : undefined,
      text: payload.text,
    });
    if (message.success == false) {
      return {
        event: 'error',
        data: { message: message.error.message },
      };
    }
    client.to(chatRoom).emit(SOCKET_MESSAGES.messageChat, message.data);
    // @ts-expect-error To have the ability to show the message instantly
    message.data._actionId = payload.id;
    return { event: SOCKET_MESSAGES.messageChat, data: message.data };
  }

  // Handle adding a reaction to a message
  @SubscribeMessage(SOCKET_MESSAGES.reactToMessage)
  async handleAddReaction(client: Socket, payload: AddReactionDto) {
    const authResult = this.sessionService.authClient(client);
    if (authResult == false) {
      return;
    }

    try {
      const result = await this.messagesService.addReaction(
        payload,
        authResult,
      );
      if (result.success == true) {
        this.server.emit(SOCKET_MESSAGES.reactToMessage, {
          messageId: payload.messageId,
          userId: authResult,
          reaction: payload.reaction,
          inc: result.data,
        });
      } else {
        return { event: 'error', data: { error: result.error.message } };
      }
    } catch (error) {
      return { event: 'error', data: { error: error.message } };
    }
  }
}
