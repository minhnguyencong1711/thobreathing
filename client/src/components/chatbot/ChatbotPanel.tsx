import React, { useRef, useEffect } from 'react';
import {
  X,
  Bot,
  Sparkles,
  Trash2,
  Clock,
  Zap,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { ChatMessage, RateLimitInfo, UserBurnoutContext } from '../../types/chatbot';

interface ChatbotPanelProps {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  rateLimitInfo: RateLimitInfo | null;
  rateLimitBanner: string | null;
  userContext?: UserBurnoutContext;
  expirationText?: string;
  remainingDays?: number;
  onClose: () => void;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
}

export const ChatbotPanel: React.FC<ChatbotPanelProps> = ({
  isOpen,
  messages,
  isTyping,
  rateLimitInfo,
  rateLimitBanner,
  userContext,
  expirationText,
  remainingDays,
  onClose,
  onSendMessage,
  onClearChat,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới hoặc đang stream
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const burnoutLevels = [
    { label: 'Bình thường', color: 'bg-green-100 text-green-700 border-green-200' },
    { label: 'Nguy cơ vừa', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { label: 'Kiệt sức cao', color: 'bg-red-100 text-red-700 border-red-200' },
  ];

  const currentLevel = userContext ? burnoutLevels[userContext.burnoutLevel] : null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[420px] sm:h-[620px] sm:max-h-[88vh] bg-white sm:rounded-3xl shadow-soft-lg z-50 flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* ─── HEADER ─── */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white flex-shrink-0 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 text-white shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-base leading-tight">
              <span>Thở AI</span>
            </div>
            <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              Đồng hành tâm lý học đường
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClearChat}
              title="Xóa lịch sử trò chuyện"
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            title="Đóng cửa sổ chat"
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ─── EXPIRATION & SESSION TRANSPARENCY BANNER ─── */}
      <div className="bg-slate-50 border-b border-slate-200 px-3.5 py-2 text-[11px] text-body-text flex flex-col gap-1 flex-shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-1">
          {/* User profile context */}
          {userContext && currentLevel && (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700">{userContext.name}</span>
              <span className="text-slate-400">({userContext.age} tuổi)</span>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${currentLevel.color}`}>
                {currentLevel.label}
              </span>
            </div>
          )}

          {/* Rate limit status live counter */}
          <div className="flex items-center gap-1 text-slate-600 font-medium ml-auto" title="Tối đa 30 tin nhắn mỗi ngày cho mỗi IP để đảm bảo tài nguyên">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span>Hôm nay: <strong className="text-primary font-bold">{rateLimitInfo ? rateLimitInfo.remainingToday : 30}/30</strong> tin</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-slate-500 pt-0.5 border-t border-slate-200/60 flex-wrap gap-x-2">
          {/* Survey session expiration */}
          {expirationText && (
            <div className="flex items-center gap-1" title="Kết quả khảo sát tự động làm mới sau 7 ngày để đảm bảo độ chính xác">
              <Clock className="w-3 h-3 text-secondary" />
              <span>Khảo sát lưu đến: <strong>{expirationText}</strong>{remainingDays ? ` (còn ${remainingDays} ngày)` : ''}</span>
            </div>
          )}

          {/* MongoDB session retention */}
          <div className="flex items-center gap-1 text-[10px] text-slate-400 ml-auto">
            <ShieldCheck className="w-3 h-3 text-green-600" />
            <span>Lịch sử lưu 30 ngày</span>
          </div>
        </div>
      </div>

      {/* ─── RATE LIMIT / ERROR ALERT BANNER ─── */}
      {rateLimitBanner && (
        <div className="bg-amber-50 border-b border-amber-200 p-2.5 px-3.5 text-xs text-amber-800 flex items-start gap-2 flex-shrink-0 animate-in slide-in-from-top-2 duration-150">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{rateLimitBanner}</div>
        </div>
      )}

      {/* ─── MESSAGE LIST ─── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#FAFBFD]">
        {/* Welcome message khi chưa có hội thoại */}
        {messages.length === 0 && (
          <div className="text-center py-6 px-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/10 to-secondary/10 text-primary flex items-center justify-center mx-auto mb-3 border border-primary/20">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-body-text">
              Chào {userContext?.name || 'bạn'}! Mình là Thở AI 🌿
            </h4>
            <p className="text-xs text-slate-500 mt-1.5 max-w-[280px] mx-auto leading-relaxed">
              Dựa trên kết quả khảo sát mức độ Burnout của bạn, mình ở đây để lắng nghe và chia sẻ phương pháp giảm căng thẳng khoa học.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-200/80 text-left">
              <SuggestedQuestions onSelect={onSendMessage} disabled={isTyping} />
            </div>
          </div>
        )}

        {/* Danh sách tin nhắn */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Loading typing indicator nếu bot đang suy nghĩ mà chưa có chunk */}
        {isTyping && messages[messages.length - 1]?.role !== 'model' && (
          <div className="my-2">
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── FOOTER & INPUT ─── */}
      <div className="p-3 bg-white border-t border-slate-200 flex-shrink-0">
        <ChatInput onSend={onSendMessage} disabled={isTyping} />

        <p className="text-[10px] text-slate-400 text-center mt-2">
          Thở AI gợi ý theo tài liệu nghiên cứu MBI-SS. Không thay thế chẩn đoán y khoa chuyên sâu.
        </p>
      </div>
    </div>
  );
};
