import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatbotRateLimitDocument = HydratedDocument<ChatbotRateLimit>;

@Schema({ collection: 'chatbot_rate_limits' })
export class ChatbotRateLimit {
  // window key: "minute:{ip}:{Math.floor(Date.now()/60000)}"
  //          or "day:{ip}:{Math.floor(Date.now()/86400000)}"
  @Prop({ required: true, unique: true, index: true })
  windowKey: string;

  @Prop({ required: true, default: 0 })
  count: number;

  // MongoDB TTL — tự xóa sau khi hết hạn
  @Prop({ type: Date, required: true, index: { expireAfterSeconds: 0 } })
  expiresAt: Date;
}

export const ChatbotRateLimitSchema = SchemaFactory.createForClass(ChatbotRateLimit);
