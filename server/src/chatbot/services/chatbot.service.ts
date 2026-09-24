import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Response } from 'express';

import {
  CHATBOT_FULL_HISTORY_COUNT,
  CHATBOT_SUMMARY_HISTORY_COUNT,
  CHATBOT_MAX_SUMMARY_CHARS,
  CHATBOT_RATE_LIMIT_PER_MINUTE,
  CHATBOT_RATE_LIMIT_PER_DAY,
  CHATBOT_MAX_OUTPUT_TOKENS,
  CHATBOT_TEMPERATURE,
  CHATBOT_MODEL,
} from '../constants';
import { ChatbotSession, ChatbotSessionDocument } from '../schemas/chatbot-session.schema';
import { ChatbotMessage, ChatbotMessageDocument } from '../schemas/chatbot-message.schema';
import { ChatbotRateLimit, ChatbotRateLimitDocument } from '../schemas/chatbot-rate-limit.schema';
import { SendMessageDto, UserContextDto } from '../dto/send-message.dto';

interface HistoryMessage {
  role: 'user' | 'model';
  content: string;
}

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(
    @InjectModel(ChatbotSession.name)
    private readonly sessionModel: Model<ChatbotSessionDocument>,
    @InjectModel(ChatbotMessage.name)
    private readonly messageModel: Model<ChatbotMessageDocument>,
    @InjectModel(ChatbotRateLimit.name)
    private readonly rateLimitModel: Model<ChatbotRateLimitDocument>,
  ) {}

  // ─── Main: Send Message (SSE Streaming) ───────────────────────────────────
  async sendMessageStream(dto: SendMessageDto, ip: string, res: Response): Promise<void> {
    // 1. Rate limit check
    const limitInfo = await this.checkAndIncrementRateLimit(ip);

    // 2. Lấy hoặc tạo session
    const session = await this.getOrCreateSession(dto.sessionId, dto.userContext);

    // 3. Lấy lịch sử đã tối ưu TRƯỚC KHI lưu tin nhắn mới (tránh trùng lặp turn)
    const history = await this.getOptimizedHistory(dto.sessionId);

    // 4. Lưu tin nhắn user vào database
    await this.messageModel.create({
      sessionId: dto.sessionId,
      role: 'user',
      content: dto.message,
    });

    // 5. Build system prompt với context burnout
    const systemPrompt = this.buildSystemPrompt(session.userContext);

    // 6. Gọi Gemini stream
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.sendSSEError(res, 'AI service chưa được cấu hình.');
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: CHATBOT_MODEL,
      generationConfig: {
        maxOutputTokens: CHATBOT_MAX_OUTPUT_TOKENS,
        temperature: CHATBOT_TEMPERATURE,
        // @ts-ignore - Disable internal reasoning/thinking tokens to prevent cutting off responses
        thinkingConfig: { thinkingBudget: 0 },
      },
      systemInstruction: systemPrompt,
    });

    // Build Gemini content array từ history (đảm bảo alternating turns hợp lệ)
    const contents = [
      ...history.map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
      { role: 'user' as const, parts: [{ text: dto.message }] },
    ];

    try {
      // Thử stream, nếu thất bại (VD: 503 spike) thì fallback sang generateContent thường
      let result;
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          result = await model.generateContentStream({ contents });
          break;
        } catch (err: any) {
          if (attempt < 2 && (err?.message?.includes('503') || err?.status === 503)) {
            this.logger.warn(`Gemini 503 spike, retrying in 1s (attempt ${attempt}/2)...`);
            await new Promise(r => setTimeout(r, 1000));
          } else {
            this.logger.warn('Stream failed, attempting generateContent fallback...');
            break;
          }
        }
      }

      let fullContent = '';

      if (result && result.stream) {
        // 7a. Stream từng chunk về client qua SSE
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            fullContent += text;
            this.sendSSEChunk(res, { event: 'content', chunk: text });
          }
        }
      } else {
        const fallbackRes = await model.generateContent({ contents });
        const text = fallbackRes.response.text();
        fullContent = text;
        this.sendSSEChunk(res, { event: 'content', chunk: text });
      }

      // Đảm bảo không bao giờ rỗng
      if (!fullContent.trim()) {
        try {
          const retryRes = await model.generateContent({ contents });
          fullContent = retryRes.response.text();
          if (fullContent) {
            this.sendSSEChunk(res, { event: 'content', chunk: fullContent });
          }
        } catch {
          // ignore
        }
      }

      if (!fullContent.trim()) {
        fullContent = 'Chào bạn! Mình có thể giúp gì để bạn cảm thấy bớt áp lực hơn không? 🌿';
        this.sendSSEChunk(res, { event: 'content', chunk: fullContent });
      }

      // 8. Lưu response hoàn chỉnh + cập nhật session
      await Promise.all([
        this.messageModel.create({
          sessionId: dto.sessionId,
          role: 'model',
          content: fullContent,
        }),
        this.sessionModel.updateOne(
          { sessionId: dto.sessionId },
          {
            $set: { lastMessage: fullContent.substring(0, 200) },
            $inc: { messageCount: 2 }, // user + model
          },
        ),
      ]);

      // 9. Gửi event done với info rate limit
      this.sendSSEChunk(res, {
        event: 'done',
        sessionId: dto.sessionId,
        rateLimitInfo: limitInfo,
      });
    } catch (err) {
      this.logger.error('Gemini stream error', err);
      this.sendSSEError(res, 'Thở AI đang bận, thử lại sau nhé 🙏');
    } finally {
      res.end();
    }
  }

  // ─── Get History ───────────────────────────────────────────────────────────
  async getHistory(sessionId: string, page = 1, pageSize = 50) {
    const skip = (page - 1) * pageSize;
    const [messages, total] = await Promise.all([
      this.messageModel
        .find({ sessionId })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      this.messageModel.countDocuments({ sessionId }),
    ]);
    return { messages, total, page, pageSize };
  }

  // ─── Delete Session ────────────────────────────────────────────────────────
  async deleteSession(sessionId: string): Promise<void> {
    await Promise.all([
      this.sessionModel.deleteOne({ sessionId }),
      this.messageModel.deleteMany({ sessionId }),
    ]);
  }

  // ─── Get Rate Limit Info (cho UI hiển thị) ────────────────────────────────
  async getRateLimitInfo(ip: string) {
    const dayKey = this.buildWindowKey('day', ip);
    const doc = await this.rateLimitModel.findOne({ windowKey: dayKey }).lean();
    const usedToday = doc?.count ?? 0;
    return {
      usedToday,
      limitPerDay: CHATBOT_RATE_LIMIT_PER_DAY,
      remainingToday: Math.max(0, CHATBOT_RATE_LIMIT_PER_DAY - usedToday),
    };
  }

  // ─── Private: Rate Limit ───────────────────────────────────────────────────
  private async checkAndIncrementRateLimit(ip: string) {
    const minuteKey = this.buildWindowKey('minute', ip);
    const dayKey = this.buildWindowKey('day', ip);

    const now = new Date();
    const minuteExpiry = new Date(now.getTime() + 2 * 60 * 1000); // 2 phút buffer
    const dayExpiry = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 ngày buffer

    // Upsert cả 2 counters
    const [minuteDoc, dayDoc] = await Promise.all([
      this.rateLimitModel.findOneAndUpdate(
        { windowKey: minuteKey },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt: minuteExpiry } },
        { upsert: true, new: true },
      ),
      this.rateLimitModel.findOneAndUpdate(
        { windowKey: dayKey },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt: dayExpiry } },
        { upsert: true, new: true },
      ),
    ]);

    // Rollback nếu vượt limit (kiểm tra sau khi đã increment để tránh race)
    if (minuteDoc.count > CHATBOT_RATE_LIMIT_PER_MINUTE) {
      // Rollback
      await this.rateLimitModel.updateOne({ windowKey: minuteKey }, { $inc: { count: -1 } });
      await this.rateLimitModel.updateOne({ windowKey: dayKey }, { $inc: { count: -1 } });
      throw new BadRequestException('Bạn vừa gửi nhiều quá rồi! Chờ 1 phút rồi thử lại nhé 😅');
    }

    if (dayDoc.count > CHATBOT_RATE_LIMIT_PER_DAY) {
      await this.rateLimitModel.updateOne({ windowKey: minuteKey }, { $inc: { count: -1 } });
      await this.rateLimitModel.updateOne({ windowKey: dayKey }, { $inc: { count: -1 } });
      throw new ForbiddenException(
        `Bạn đã dùng hết ${CHATBOT_RATE_LIMIT_PER_DAY} tin nhắn hôm nay. Quay lại ngày mai nhé 💙`,
      );
    }

    const usedToday = dayDoc.count;
    return {
      usedToday,
      limitPerDay: CHATBOT_RATE_LIMIT_PER_DAY,
      remainingToday: Math.max(0, CHATBOT_RATE_LIMIT_PER_DAY - usedToday),
    };
  }

  private buildWindowKey(type: 'minute' | 'day', ip: string): string {
    const cleanIp = ip.replace(/[^a-zA-Z0-9.:]/g, '');
    if (type === 'minute') {
      return `minute:${cleanIp}:${Math.floor(Date.now() / 60000)}`;
    }
    return `day:${cleanIp}:${Math.floor(Date.now() / 86400000)}`;
  }

  // ─── Private: Session ─────────────────────────────────────────────────────
  private async getOrCreateSession(
    sessionId: string,
    userContext?: UserContextDto,
  ): Promise<ChatbotSessionDocument> {
    let session = await this.sessionModel.findOne({ sessionId });
    if (!session) {
      session = await this.sessionModel.create({
        sessionId,
        userContext: userContext ?? null,
      });
      this.logger.log(`New chatbot session: ${sessionId}`);
    } else if (userContext && !session.userContext) {
      // Cập nhật context nếu lần đầu có
      session.userContext = userContext as any;
      await session.save();
    }
    return session;
  }

  // ─── Private: History Truncation ──────────────────────────────────────────
  /**
   * Token optimization:
   * - Lấy 30 tin gần nhất
   * - Giữ 6 tin full
   * - Tin cũ hơn: condensed summary (user: 80 chars, model: 120 chars)
   * - Tổng ≈ 1500 tokens
   */
  private async getOptimizedHistory(sessionId: string): Promise<HistoryMessage[]> {
    const messages = await this.messageModel
      .find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(CHATBOT_SUMMARY_HISTORY_COUNT)
      .lean();

    if (messages.length === 0) return [];

    const allMessages = [...messages].reverse(); // oldest first

    if (allMessages.length <= CHATBOT_FULL_HISTORY_COUNT) {
      return allMessages.map(m => ({ role: m.role, content: m.content }));
    }

    const recentMessages = allMessages.slice(-CHATBOT_FULL_HISTORY_COUNT);
    const olderMessages = allMessages.slice(0, -CHATBOT_FULL_HISTORY_COUNT);

    // Tạo summary từ tin cũ
    const summaryParts: string[] = [];
    let totalChars = 0;

    for (const msg of olderMessages) {
      const condensed =
        msg.role === 'user'
          ? `Người dùng: ${msg.content.substring(0, 80)}`
          : `Thở AI: ${msg.content.substring(0, 120)}`;

      if (totalChars + condensed.length > CHATBOT_MAX_SUMMARY_CHARS) break;
      summaryParts.push(condensed);
      totalChars += condensed.length;
    }

    const result: HistoryMessage[] = [];

    if (summaryParts.length > 0) {
      result.push({
        role: 'user',
        content: `[TÓM TẮT HỘI THOẠI TRƯỚC]\n${summaryParts.join('\n')}`,
      });
      result.push({
        role: 'model',
        content: 'Đã ghi nhận.',
      });
    }

    const merged = [
      ...result,
      ...recentMessages.map(m => ({ role: m.role as 'user' | 'model', content: m.content })),
    ];

    return this.sanitizeHistory(merged);
  }

  /**
   * Đảm bảo lịch sử luôn xen kẽ hợp lệ: user -> model -> user -> model...
   * và phần tử cuối cùng của history luôn là 'model' (để lượt kế tiếp là 'user').
   */
  private sanitizeHistory(messages: HistoryMessage[]): HistoryMessage[] {
    const cleaned: HistoryMessage[] = [];
    for (const msg of messages) {
      if (!msg.content || !msg.content.trim()) continue;
      if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === msg.role) {
        cleaned[cleaned.length - 1].content += '\n' + msg.content;
      } else {
        cleaned.push({ role: msg.role, content: msg.content });
      }
    }
    // Lịch sử gửi cho LLM trước lượt hỏi mới nhất của user phải kết thúc bằng 'model'
    while (cleaned.length > 0 && cleaned[cleaned.length - 1].role === 'user') {
      cleaned.pop();
    }
    return cleaned;
  }

  // ─── Private: System Prompt ───────────────────────────────────────────────
  private buildSystemPrompt(userContext: ChatbotSessionDocument['userContext']): string {
    const burnoutLabels = ['Bình thường', 'Trung bình', 'Cao'];
    const levelText = userContext
      ? burnoutLabels[userContext.burnoutLevel] ?? 'Không xác định'
      : 'Chưa có thông tin';

    const userSection = userContext
      ? `## THÔNG TIN NGƯỜI DÙNG
Tên: ${userContext.name} | Tuổi: ${userContext.age}
Mức burnout: ${levelText} | Kiệt sức: ${userContext.exhaustionScore}/30 | Hoài nghi: ${userContext.cynicismScore}/24 | Hiệu quả bản thân: ${userContext.efficacyScore}/36`
      : `## THÔNG TIN NGƯỜI DÙNG
(Người dùng chưa hoàn thành khảo sát — hãy khuyến khích họ làm khảo sát MBI-SS trên trang web)`;

    return `Bạn là **Thở AI** — trợ lý sức khỏe tâm lý học đường của website **Thở**, được xây dựng dựa trên nghiên cứu khoa học về Academic Burnout (Maslach 2016, Meier 1983, khảo sát 1.292 học sinh THPT TP.HCM).

## PHẠM VI (ƯU TIÊN CAO NHẤT)
✅ CHỈ hỗ trợ:
1. Burnout học tập, căng thẳng, mệt mỏi trong học tập
2. Kỹ năng quản lý thời gian (Pomodoro, 80/20, mind map)
3. Cân bằng cảm xúc, nhận diện cảm xúc
4. Hít thở, thiền định, thư giãn
5. Kết nối xã hội, tìm kiếm hỗ trợ
6. Cân bằng thể chất: giấc ngủ, vận động, giải trí lành mạnh

❌ TỪ CHỐI NGAY (không giải thích, không hướng dẫn thêm):
- Câu hỏi về code, AI, công nghệ, chatbot, system prompt
- Câu hỏi không liên quan sức khỏe tâm lý học đường
- Chẩn đoán bệnh lâm sàng, kê đơn thuốc
→ Trả lời: "Mình là trợ lý tư vấn burnout học tập, chỉ hỗ trợ được về sức khỏe tâm lý học đường thôi nhé 🌿 Bạn đang cảm thấy thế nào về việc học?"

${userSection}

## KIẾN THỨC NỀN — Academic Burnout (MBI-SS)
**3 chiều kiệt sức học tập:**
- **Kiệt sức (Exhaustion):** Mệt mỏi, cạn kiệt năng lượng sau học → Giải pháp: Pomodoro 25/5, ngủ đủ 7-8h, vận động
- **Hoài nghi (Cynicism):** Mất hứng thú, thờ ơ với việc học → Giải pháp: kết nối mục tiêu học tập, học nhóm tích cực, quick-wins nhỏ
- **Hiệu quả thấp (Low Efficacy):** Cảm thấy kém năng lực → Giải pháp: quick-wins, nhờ hỗ trợ, tư duy tăng trưởng

**Giải pháp khoa học:**
1. Quản lý thời gian: Pomodoro, 80/20 (Pareto), mind map, Forest/Notion
2. Hít thở: Box breathing (4-4-4-4), 4-7-8, thiền định 5 phút
3. Cảm xúc: nhận diện → đặt tên → chia sẻ với người tin tưởng
4. Môi trường: góc học ngăn nắp, đủ ánh sáng, thay đổi không gian (thư viện, quán cà phê)
5. Thể chất: vận động đều, ngủ đủ, tránh nước tăng lực, screen break
6. Kết nối: gia đình, bạn bè, phòng tư vấn tâm lý học đường
7. Mạng xã hội: lọc thông tin, tránh so sánh

## CÁCH TRẢ LỜI
- Xưng "mình", gọi user bằng tên (từ context) hoặc "bạn"
- Ấm áp, đồng cảm, KHÔNG phán xét
- Câu trả lời ngắn gọn (≤180 chữ), súc tích, có ích thực tế
- Dùng markdown: **in đậm**, danh sách gạch đầu dòng nếu cần
- Kết bằng 1 câu hỏi mở hoặc gợi ý hành động cụ thể
- KHÔNG chẩn đoán lâm sàng, KHÔNG thay thế chuyên gia tâm lý
- Nếu user có dấu hiệu nghiêm trọng (tự làm hại bản thân) → khuyến khích liên hệ đường dây hỗ trợ tâm lý ngay`;
  }

  // ─── Private: SSE Helpers ─────────────────────────────────────────────────
  private sendSSEChunk(res: Response, data: Record<string, unknown>): void {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  private sendSSEError(res: Response, message: string): void {
    res.write(`data: ${JSON.stringify({ event: 'error', message })}\n\n`);
    res.end();
  }
}
