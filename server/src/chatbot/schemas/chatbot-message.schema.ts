import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CHATBOT_SESSION_TTL_DAYS } from '../constants';

export type ChatbotMessageDocument = HydratedDocument<ChatbotMessage>;

@Schema({ collection: 'chatbot_messages' })
export class ChatbotMessage {
  @Prop({ required: true, index: true })
  sessionId: string;

  @Prop({ required: true, enum: ['user', 'model'] })
  role: 'user' | 'model';

  @Prop({ default: '' })
  content: string;

  @Prop({
    type: Date,
    default: () => new Date(),
    expires: CHATBOT_SESSION_TTL_DAYS * 24 * 60 * 60,
    index: true,
  })
  createdAt: Date;
}

export const ChatbotMessageSchema = SchemaFactory.createForClass(ChatbotMessage);
// Compound index để query history hiệu quả
ChatbotMessageSchema.index({ sessionId: 1, createdAt: -1 });
