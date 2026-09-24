import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SurveysModule } from './surveys/surveys.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    // Biến môi trường .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'server/.env', '../.env'],
    }),

    // Kết nối MongoDB Atlas (hoặc Local MongoDB)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri:
          config.get<string>('MONGODB_URI') ||
          'mongodb://127.0.0.1:27017/thobreathing',
        retryWrites: true,
        w: 'majority',
      }),
    }),

    // Chống DDoS & Spam API (Mặc định 60 requests/phút mỗi IP)
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),

    // Phục vụ Single Page App React từ thư mục build client/dist (Phương án B)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist'),
      exclude: ['/api/(.*)'],
    }),

    SurveysModule,
    ChatbotModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
