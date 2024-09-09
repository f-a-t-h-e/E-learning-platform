import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ExtractInterface } from '../../common/types';

@Schema()
export class Message extends Document {
  @Prop({ type: Number, required: true })
  author: Number;

  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chatId: Types.ObjectId | string;

  @Prop({ type: String })
  text: string;

  //   @Prop({ type: [String], default: [] })
  //   attachments: string[];

  @Prop({
    type: {
      chatId: { type: Types.ObjectId, ref: 'Chat' },
      authorId: { type: Number },
    },
    default: null,
  })
  redirectFrom: {
    chatId: Types.ObjectId;
    authorId: Number;
  };

  @Prop({
    type: {
      messageId: { type: Types.ObjectId, ref: 'Message' },
      authorId: { type: Number },
    },
    default: null,
  })
  replyTo: {
    messageId: Types.ObjectId | Message | string;
    authorId: Number;
  };

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({
    type: Map,
    of: Number,
  })
  reactions: Map<string, number>;

  @Prop({ type: Map, of: String })
  usersReactions: Map<string, string>;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date })
  editedAt?: Date;

  //   @Prop({ type: Types.ObjectId, ref: 'Report' })
  //   reports?: Types.ObjectId;
}
export type TMessage = ExtractInterface<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);
