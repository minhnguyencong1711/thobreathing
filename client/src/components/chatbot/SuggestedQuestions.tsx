import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const DEFAULT_SUGGESTIONS = [
  'Làm sao để bớt kiệt sức khi học?',
  'Cách áp dụng Pomodoro 25/5 hiệu quả?',
  'Mình thấy mất hứng thú với việc học...',
  'Hướng dẫn bài tập thở hộp (Box breathing)',
  'Làm sao ngừng so sánh điểm với bạn bè?',
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelect,
  disabled,
}) => {
  return (
    <div className="py-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span>Gợi ý chủ đề thường gặp:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DEFAULT_SUGGESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(q)}
            className="text-xs bg-slate-100 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-slate-200 text-body-text px-3 py-1.5 rounded-full transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
