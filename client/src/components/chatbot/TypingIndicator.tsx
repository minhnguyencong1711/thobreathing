import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white/90 border border-slate-200/80 rounded-2xl rounded-tl-sm w-fit shadow-sm">
      <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '300ms' }} />
      <span className="text-xs text-slate-400 font-medium ml-1.5">Thở AI đang suy nghĩ...</span>
    </div>
  );
};
