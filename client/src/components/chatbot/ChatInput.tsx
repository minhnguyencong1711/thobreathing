import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const MAX_CHARS = 500;

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const remaining = MAX_CHARS - text.length;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          maxLength={MAX_CHARS}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? 'Thở AI đang phản hồi...' : 'Nhập câu hỏi hoặc tâm sự của bạn...'}
          className="flex-1 bg-transparent text-sm text-body-text placeholder-slate-400 resize-none outline-none max-h-[120px] py-1 px-2 leading-relaxed"
        />

        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="w-9 h-9 rounded-xl bg-primary hover:bg-primary-hover active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-xs"
          title="Gửi tin nhắn (Enter)"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      {/* Hiển thị số ký tự và phím tắt */}
      <div className="flex items-center justify-between px-2 pt-1.5 text-[11px] text-slate-400">
        <span className="hidden sm:inline-flex items-center gap-1">
          Nhấn <kbd className="px-1 py-0.5 bg-slate-200/70 text-slate-600 rounded text-[10px]">Enter</kbd> để gửi
        </span>
        <span className={remaining < 50 ? 'text-orange-500 font-semibold ml-auto' : 'ml-auto'}>
          {text.length}/{MAX_CHARS}
        </span>
      </div>
    </form>
  );
};
