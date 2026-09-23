import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ChatbotService } from '../services/chatbot.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  /**
   * POST /api/chatbot/message
   * SSE streaming endpoint — trả về text/event-stream
   * Events: { event: 'content', chunk: string }
   *         { event: 'done', sessionId, rateLimitInfo }
   *         { event: 'error', message }
   */
  @Post('message')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 8, ttl: 60000 } }) // outer guard: 8/phút (inner check là 5)
  async sendMessage(
    @Body() dto: SendMessageDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Setup SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Tắt Nginx buffering nếu có

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      ?? req.socket?.remoteAddress
      ?? 'unknown';

    try {
      await this.chatbotService.sendMessageStream(dto, ip, res);
    } catch (err: any) {
      // BadRequestException hoặc ForbiddenException từ rate limit
      const status = err?.status ?? 500;
      const message = err?.message ?? 'Đã có lỗi xảy ra';

      if (!res.headersSent) {
        res.setHeader('Content-Type', 'text/event-stream');
      }
      res.write(`data: ${JSON.stringify({ event: 'error', message, status })}\n\n`);
      res.end();
    }
  }

  /**
   * GET /api/chatbot/history/:sessionId
   * Lấy lịch sử chat theo sessionId (phân trang)
   */
  @Get('history/:sessionId')
  async getHistory(
    @Param('sessionId') sessionId: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '50',
  ) {
    return this.chatbotService.getHistory(
      sessionId,
      parseInt(page, 10),
      parseInt(pageSize, 10),
    );
  }

  /**
   * GET /api/chatbot/rate-limit
   * Lấy thông tin rate limit hiện tại của IP (cho UI hiển thị)
   */
  @Get('rate-limit')
  async getRateLimitInfo(@Req() req: Request) {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      ?? req.socket?.remoteAddress
      ?? 'unknown';
    return this.chatbotService.getRateLimitInfo(ip);
  }

  /**
   * DELETE /api/chatbot/session/:sessionId
   * Xóa toàn bộ session + messages
   */
  @Delete('session/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(@Param('sessionId') sessionId: string) {
    await this.chatbotService.deleteSession(sessionId);
  }
}
