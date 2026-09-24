import React from 'react';
import { X, Download, ExternalLink, Sparkles } from 'lucide-react';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PosterModal: React.FC<PosterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl z-10 border border-black/10 animate-in zoom-in-95 duration-200 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-gray-400 hover:text-body-text hover:bg-gray-100 transition-colors z-20 bg-white/80 backdrop-blur"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
          <Sparkles className="w-3.5 h-3.5" /> Dự án Thở
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-body-text">
          Poster Truyền Thông Dự Án
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-[#5A6A7D] leading-relaxed">
          Thông điệp <em>"Nhận diện áp lực — Học cách cân bằng — Bảo vệ sức khỏe tinh thần học đường"</em> của nhóm học sinh THPT.
        </p>

        {/* Poster Image Container */}
        <div className="my-4 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner flex items-center justify-center max-h-[62vh]">
          <img
            src="/poster.png"
            alt="Poster truyền thông dự án Thở"
            className="w-full h-auto max-h-[62vh] object-contain rounded-2xl transition-transform hover:scale-[1.01]"
            loading="lazy"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <a
              href="/poster.png"
              download="Poster_Du_An_Tho.png"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Download className="w-4 h-4 text-primary" />
              Tải xuống poster
            </a>
            <a
              href="/poster.png"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Xem ảnh gốc
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl font-bold text-xs sm:text-sm bg-primary text-white shadow-primary-glow hover:bg-primary-hover active:scale-95 transition-all ml-auto"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
