import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, RateLimitInfo, UserBurnoutContext } from '../types/chatbot';
import { chatbotApi } from '../services/chatbot.service';

const SESSION_KEY = 'tho_chatbot_session_id';

function getOrCreateSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = 'session-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'session-fallback-' + Date.now();
  }
}

export function useChatbot(userContext?: UserBurnoutContext) {
  const [sessionId] = useState<string>(getOrCreateSessionId);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const [rateLimitBanner, setRateLimitBanner] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const historyLoadedRef = useRef(false);

  // Load lịch sử và rate limit lần đầu
  useEffect(() => {
    if (historyLoadedRef.current) return;
    historyLoadedRef.current = true;

    chatbotApi.getHistory(sessionId).then((hist) => {
      if (hist && hist.length > 0) {
        setMessages(hist);
      }
    });

    chatbotApi.getRateLimit().then((rl) => {
      if (rl) setRateLimitInfo(rl);
    });
  }, [sessionId]);

  // Tự ẩn banner rate limit sau 6s
  useEffect(() => {
    if (!rateLimitBanner) return;
    const timer = setTimeout(() => {
      setRateLimitBanner(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [rateLimitBanner]);

  // Xóa unread khi mở chat
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const toggleOpen = useCallback((force?: boolean) => {
    setIsOpen((prev) => (typeof force === 'boolean' ? force : !prev));
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setRateLimitBanner(null);

      // 1. Thêm message user
      const userMsgId = 'u-' + Date.now();
      const userMsg: ChatMessage = {
        id: userMsgId,
        role: 'user',
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      // 2. Thêm placeholder message cho model
      const botMsgId = 'b-' + Date.now();
      const botMsg: ChatMessage = {
        id: botMsgId,
        role: 'model',
        content: '',
        createdAt: new Date().toISOString(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, botMsg]);
      setIsTyping(true);

      // Abort request cũ nếu có
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      let streamContent = '';

      await chatbotApi.sendMessageStream({
        sessionId,
        message: trimmed,
        userContext,
        signal: abortControllerRef.current.signal,
        onChunk: (chunk: string) => {
          streamContent += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId
                ? { ...msg, content: streamContent, isStreaming: true }
                : msg,
            ),
          );
        },
        onDone: (newRateLimitInfo?: RateLimitInfo) => {
          setIsTyping(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, isStreaming: false } : msg,
            ),
          );
          if (newRateLimitInfo) {
            setRateLimitInfo(newRateLimitInfo);
          }
          if (!isOpen) {
            setUnreadCount((c) => c + 1);
          }
        },
        onError: (errMsg: string) => {
          setIsTyping(false);
          setRateLimitBanner(errMsg);
          // Xóa placeholder bot message nếu chưa nhận được chunk nào
          setMessages((prev) => {
            const target = prev.find((m) => m.id === botMsgId);
            if (target && !target.content) {
              return prev.filter((m) => m.id !== botMsgId);
            }
            return prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, isStreaming: false } : msg,
            );
          });
        },
      });
    },
    [isTyping, sessionId, userContext, isOpen],
  );

  const clearChat = useCallback(async () => {
    try {
      await chatbotApi.clearSession(sessionId);
      setMessages([]);
      localStorage.removeItem(SESSION_KEY);
      // Tạo session mới
      getOrCreateSessionId();
    } catch (e) {
      console.error('Failed to clear chat session', e);
    }
  }, [sessionId]);

  return {
    sessionId,
    isOpen,
    messages,
    isTyping,
    rateLimitInfo,
    rateLimitBanner,
    unreadCount,
    toggleOpen,
    sendMessage,
    clearChat,
  };
}
