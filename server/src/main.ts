import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Bảo vệ tiến trình Node khỏi việc bị crash (Exited with status 1) do stream error hoặc unhandled rejection
  process.on('unhandledRejection', (reason: any) => {
    logger.error('⚠️ Unhandled Rejection intercepted:', reason?.stack || reason);
  });

  process.on('uncaughtException', (err: any) => {
    logger.error('⚠️ Uncaught Exception intercepted:', err?.stack || err);
  });

  const app = await NestFactory.create(AppModule);

  // Bảo mật HTTP Headers với Helmet (Đảm bảo cho phép nhúng video YouTube & Fonts)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  // Bật CORS cho phép gọi API khi chạy độc lập
  app.enableCors({
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, 'http://localhost:5173'] : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Tiền tố API cho tất cả controller: /api/*
  app.setGlobalPrefix('api');

  // Tự động validate DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Thở Server is running on: http://localhost:${port}`);
  logger.log(`📡 API Endpoints available at: http://localhost:${port}/api`);
}

bootstrap();
