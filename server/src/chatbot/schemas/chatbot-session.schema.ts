import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CHATBOT_SESSION_TTL_DAYS } from '../constants';

export type ChatbotSessionDocument = HydratedDocument<ChatbotSession>;

@Schema({ _id: false })
export class UserBurnoutContext {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) age: number;
  @Prop({ required: true }) burnoutLevel: number; // 0|1|2
  @Prop({ required: true }) exhaustionScore: number;
  @Prop({ required: true }) cynicismScore: number;
  @Prop({ required: true }) efficacyScore: number;
}

@Schema({ timestamps: true, collection: 'chatbot_sessions' })
export class ChatbotSession {
  @Prop({ required: true, unique: true, index: true })
  sessionId: string;

  @Prop({ type: UserBurnoutContext, required: false, default: null })
  userContext: UserBurnoutContext | null;

  @Prop({ default: '' })
  lastMessage: string;

  @Prop({ default: 0 })
  messageCount: number;

  // TTL: MongoDB tự xóa sau N ngày
  @Prop({
    type: Date,
    default: () => new Date(),
    expires: CHATBOT_SESSION_TTL_DAYS * 24 * 60 * 60, // giây
  })
  createdAt: Date;
}

export const ChatbotSessionSchema = SchemaFactory.createForClass(ChatbotSession);
