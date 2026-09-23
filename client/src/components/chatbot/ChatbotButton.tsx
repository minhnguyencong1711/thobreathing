import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface ChatbotButtonProps {
  isOpen: boolean;
  unreadCount: number;
  onToggle: () => void;
}

const BUBBLE_SIZE = 58;
const DEFAULT_BOTTOM = 24;
const HEADER_CLEARANCE = 80;

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({
  isOpen,
  unreadCount,
  onToggle,
}) => {
  // Khoảng cách từ mép dưới màn hình (px), mặc định góc dưới bên phải
  const [bottomOffset, setBottomOffset] = useState<number>(DEFAULT_BOTTOM);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ startY: number; initBottom: number } | null>(null);

  // Đảm bảo nút luôn nằm trong phạm vi hiển thị khi đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setBottomOffset((prev) => {
        const maxBottom = Math.max(DEFAULT_BOTTOM, window.innerHeight - BUBBLE_SIZE - HEADER_CLEARANCE);
        return Math.min(Math.max(DEFAULT_BOTTOM, prev), maxBottom);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = false;
    dragStartRef.current = {
      startY: e.clientY,
      initBottom: bottomOffset,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const dy = e.clientY - dragStartRef.current.startY;

    if (!isDraggingRef.current && Math.abs(dy) > 5) {
      isDraggingRef.current = true;
      setIsDragging(true);
    }

    if (isDraggingRef.current) {
      // dy > 0: kéo xuống (giảm bottomOffset), dy < 0: kéo lên (tăng bottomOffset)
      const newBottom = dragStartRef.current.initBottom - dy;
      const maxBottom = Math.max(DEFAULT_BOTTOM, window.innerHeight - BUBBLE_SIZE - HEADER_CLEARANCE);
      const clampedBottom = Math.min(Math.max(DEFAULT_BOTTOM, newBottom), maxBottom);
      setBottomOffset(clampedBottom);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (!isDraggingRef.current) {
      // Tap / Click bình thường nếu không kéo
      onToggle();
    }

    dragStartRef.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  if (isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: `${bottomOffset}px`,
        zIndex: 50,
        touchAction: 'none',
      }}
      className={`right-4 sm:right-6 select-none group ${
        isDragging ? 'cursor-grabbing' : 'cursor-pointer'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      title="Thở AI — Trợ lý sức khỏe tâm lý"
    >
      <div className="relative">
        {/* Nút chính */}
        <button
          type="button"
          className="w-[58px] h-[58px] rounded-full bg-gradient-to-tr from-primary to-secondary text-white shadow-soft-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 border-2 border-white ring-4 ring-primary/20"
        >
          <Bot className="w-7 h-7 text-white drop-shadow-sm" />
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 absolute top-2 right-2 animate-pulse" />
        </button>

        {/* Badge số tin nhắn chưa đọc */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Nhãn hướng dẫn khi hover trên desktop */}
        <div className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-body-text/90 backdrop-blur text-white text-xs font-medium rounded-xl whitespace-nowrap shadow-soft pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Trò chuyện cùng Thở AI 🌿
        </div>
      </div>
    </div>
  );
};
