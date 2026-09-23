import { ChatMessage, RateLimitInfo, UserBurnoutContext } from '../types/chatbot';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface SendMessageStreamParams {
  sessionId: string;
  message: string;
  userContext?: UserBurnoutContext;
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
  onDone: (rateLimitInfo?: RateLimitInfo) => void;
  onError: (errorMessage: string) => void;
}

export const chatbotApi = {
  async getHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const res = await fetch(`${API_BASE}/chatbot/history/${sessionId}?page=1&pageSize=50`);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.messages || []).map((m: any) => ({
        id: m._id || String(Math.random()),
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      }));
    } catch {
      return [];
    }
  },

  async getRateLimit(): Promise<RateLimitInfo | null> {
    try {
      const res = await fetch(`${API_BASE}/chatbot/rate-limit`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async clearSession(sessionId: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/chatbot/session/${sessionId}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
  },

  async sendMessageStream(params: SendMessageStreamParams): Promise<void> {
    const { sessionId, message, userContext, signal, onChunk, onDone, onError } = params;

    try {
      const res = await fetch(`${API_BASE}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message,
          userContext,
        }),
        signal,
      });

      if (!res.ok) {
        let errorMsg = 'Không thể gửi tin nhắn lúc này.';
        try {
          const errData = await res.json();
          if (errData.message) errorMsg = errData.message;
        } catch {
          // ignore
        }
        onError(errorMsg);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        onError('Trình duyệt không hỗ trợ đọc stream.');
        return;
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const line = part.trim();
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.event === 'content' && typeof data.chunk === 'string') {
                onChunk(data.chunk);
              } else if (data.event === 'done') {
                onDone(data.rateLimitInfo);
              } else if (data.event === 'error') {
                onError(data.message || 'Lỗi xử lý phản hồi từ AI.');
              }
            } catch {
              // ignore malformed chunks
            }
          }
        }
      }

      // Flush remaining buffer if any
      if (buffer.trim().startsWith('data: ')) {
        try {
          const data = JSON.parse(buffer.trim().substring(6));
          if (data.event === 'content' && typeof data.chunk === 'string') {
            onChunk(data.chunk);
          } else if (data.event === 'done') {
            onDone(data.rateLimitInfo);
          }
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User aborted, normal
        return;
      }
      onError('Mất kết nối với máy chủ. Vui lòng thử lại!');
    }
  },
};
