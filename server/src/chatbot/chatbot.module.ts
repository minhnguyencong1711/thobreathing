import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatbotController } from './controllers/chatbot.controller';
import { ChatbotService } from './services/chatbot.service';
import {
  ChatbotSession,
  ChatbotSessionSchema,
} from './schemas/chatbot-session.schema';
import {
  ChatbotMessage,
  ChatbotMessageSchema,
} from './schemas/chatbot-message.schema';
import {
  ChatbotRateLimit,
  ChatbotRateLimitSchema,
} from './schemas/chatbot-rate-limit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatbotSession.name, schema: ChatbotSessionSchema },
      { name: ChatbotMessage.name, schema: ChatbotMessageSchema },
      { name: ChatbotRateLimit.name, schema: ChatbotRateLimitSchema },
    ]),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
