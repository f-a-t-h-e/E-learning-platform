import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RequestUser } from 'common/entities/request-user.entity';
import { Socket } from 'socket.io';

@Injectable()
export class SessionService {
  private userIdToClientId: { [userId: number]: string[] } = {};
  private clientIdToUserId: { [clientId: string]: number } = {};
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async addClient(client: Socket) {
    const token = client.handshake?.headers?.authorization?.split(' ')[1];

    if (!token) {
      client.emit('error', 'Unauthorized');
      client.disconnect();
    }
    try {
      const payload = await this.jwtService.verifyAsync<RequestUser>(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
      if (this.userIdToClientId[payload.userId]) {
        this.userIdToClientId[payload.userId].push(client.id);
        this.clientIdToUserId[client.id] = payload.userId;
      } else {
        this.userIdToClientId[payload.userId] = [client.id];
        this.clientIdToUserId[client.id] = payload.userId;
      }
    } catch (error: any) {
      client.emit('error', 'Unauthorized');
      client.disconnect();
    }
  }

  authClient(client: Socket) {
    if (typeof this.clientIdToUserId[client.id] == 'number') {
      return this.clientIdToUserId[client.id];
    }
    client.emit('error', 'Unauthorized');
    client.disconnect();
    return false;
  }

  async removeClient(client: Socket) {
    const userId = this.clientIdToUserId[client.id];
    delete this.clientIdToUserId[client.id];
    if (this.userIdToClientId[userId]) {
      this.userIdToClientId[userId] = this.userIdToClientId[userId].filter(
        (id) => id !== client.id,
      );
      if (this.userIdToClientId[userId].length == 0) {
        delete this.userIdToClientId[userId];
      }
    }
  }

  getClientIds(userId: number) {
    return this.userIdToClientId[userId];
  }
}
