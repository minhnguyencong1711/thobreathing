import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { ChatMessage } from '../../types/chatbot';
import { TypingIndicator } from './TypingIndicator';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isStreamingPending = !isUser && message.isStreaming && !message.content;

  // Format giờ gửi
  const timeFormatted = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  // Khi bot đang chờ stream chunk đầu tiên -> hiển thị hiệu ứng 3 chấm nảy (TypingIndicator)
  if (isStreamingPending) {
    return (
      <div className="flex gap-2.5 items-end my-3 flex-row animate-in fade-in duration-200">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xs bg-gradient-to-tr from-secondary to-primary">
          <Bot className="w-4 h-4" />
        </div>
        <TypingIndicator />
      </div>
    );
  }

  return (
    <div className={`flex gap-2.5 items-end my-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
          isUser
            ? 'bg-gradient-to-tr from-primary to-primary-hover'
            : 'bg-gradient-to-tr from-secondary to-primary'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble nội dung */}
      <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-primary text-white rounded-tr-xs shadow-soft'
              : 'bg-white text-body-text rounded-tl-xs border border-slate-200/80 shadow-xs'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none text-body-text prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-li:my-0.5 font-normal">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-1.5 h-3.5 bg-primary/70 ml-1 animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {timeFormatted && (
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {timeFormatted}
          </span>
        )}
      </div>
    </div>
  );
};
