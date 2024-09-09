import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExtractInterface } from '../../common/types';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: Number, required: true })
  sender: number;

  @Prop({ type: Number, required: true })
  recipient: number;

  @Prop({ type: String })
  senderTitle?: string;

  @Prop({ type: String })
  recipientTitle?: string;

  // enum: ['question-answering', 'discussion', 'assignment-help', 'feedback']
  @Prop({ type: String })
  purpose: string;

  @Prop({ type: Date })
  acceptedAt?: Date;

  @Prop({ type: Number })
  isArchivedBy?: number;

  @Prop({ type: Date, default: () => new Date() })
  lastUpdate: Date;
}

export type TChat = ExtractInterface<Chat>;

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.index({ sender: 1 });
ChatSchema.index({ recipient: 1 });
ChatSchema.index({ lastUpdate: -1 });
