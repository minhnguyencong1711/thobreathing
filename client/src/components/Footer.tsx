import React from 'react';
import { Wind } from 'lucide-react';

interface FooterProps {
  onOpenPoster: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPoster }) => {
  return (
    <footer className="bg-body-text text-[#C4CEDE] py-16 border-t border-white/10 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 font-extrabold text-xl text-white mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
                <Wind className="w-4 h-4" />
              </div>
              <span>Thở</span>
            </div>
            <p className="text-sm text-[#A0AEC0] max-w-md leading-relaxed">
              Một dự án học sinh vì học sinh — vì mỗi người trong chúng ta đều xứng đáng được học tập và trưởng thành mà không phải kiệt sức.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-base mb-3">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onOpenPoster}
                  className="hover:text-white transition-colors"
                >
                  Poster nhóm
                </button>
              </li>
              <li>
                <a href="#quiz" className="hover:text-white transition-colors">
                  Làm bài kiểm tra
                </a>
              </li>
              <li>
                <a href="#timer" className="hover:text-white transition-colors">
                  Bấm giờ Pomodoro
                </a>
              </li>
                {/* <li>
                  <a href="#form" className="hover:text-white transition-colors">
                    Góp ý
                  </a>
                </li> */}
              </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8492A3]">
          <span>© 2026 Nhóm dự án Thở. Được xây dựng với sự thấu cảm và sẻ chia.</span>
          <span>Chúc bạn một ngày học tập nhẹ nhõm và đủ năng lượng 🌤️</span>
        </div>
      </div>
    </footer>
  );
};
