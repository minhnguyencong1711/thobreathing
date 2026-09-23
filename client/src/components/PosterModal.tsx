import React from 'react';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PosterModal: React.FC<PosterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl z-10 border border-black/10 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-body-text hover:bg-gray-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Dự án Thở
        </span>
        <h3 className="text-2xl font-extrabold text-body-text">Poster Truyền thông Dự án</h3>
        <p className="mt-2 text-sm text-[#5A6A7D] leading-relaxed">
          Poster truyền thông trực quan mang thông điệp <em>"Nhận diện áp lực — Học cách cân bằng — Bảo vệ sức khỏe tinh thần học đường"</em> của nhóm học sinh THPT.
        </p>

        <div className="my-6 p-10 rounded-2xl bg-[#F8F9FA] border-2 border-dashed border-[#E89FB2] text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <ImageIcon className="w-8 h-8" />
          </div>
          <strong className="text-base font-extrabold text-body-text">
            Poster truyền thông Dự án Thở
          </strong>
          <span className="text-xs text-[#8492A3] mt-1">
            Được thiết kế theo bảng màu Vibrant Pink &amp; Bright Royal Blue
          </span>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-bold text-sm bg-primary text-white shadow-primary-glow hover:bg-primary-hover transition-all"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
