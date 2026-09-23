import React from 'react';
import { ArrowRight, Image as ImageIcon, Heart, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenPoster: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPoster }) => {
  return (
    <section className="py-16 md:py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text & CTA */}
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Dành cho học sinh đang quá tải
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.25] text-body-text">
            Một hơi thở sâu, có kiểm soát là{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              phương thuốc tự nhiên
            </span>
            , miễn phí và mạnh mẽ nhất để chữa lành mọi sự lo âu.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#4A5A6D] leading-relaxed max-w-xl">
            Burnout học đường không phải là yếu đuối — đó là tín hiệu cơ thể xin được nghỉ. Thở giúp bạn đo mức năng lượng, tìm trạm sạc lại, và lên kế hoạch học tập cân bằng không kiệt sức.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-stretch sm:items-center">
            <a
              href="#quiz"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-base text-white bg-primary shadow-primary-glow hover:bg-primary-hover hover:-translate-y-0.5 transition-all text-center"
            >
              <span>Đo mức burnout của bạn</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <button
              onClick={onOpenPoster}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-base text-body-text bg-white border border-black/10 shadow-sm hover:border-secondary hover:text-secondary hover:-translate-y-0.5 transition-all text-center"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Poster của nhóm</span>
            </button>
          </div>
        </div>

        {/* Right Column: Breathing Pulse Visual */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-square flex items-center justify-center">
            {/* Outer dashed ring */}
            <div 
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#E89FB2]/70 bg-radial from-[#E89FB2]/15 to-transparent animate-breathe"
            />
            {/* Middle ring */}
            <div 
              className="absolute w-[76%] h-[76%] rounded-full border-2 border-primary/35 bg-radial from-secondary/10 to-transparent animate-breathe"
              style={{ animationDelay: '0.8s' }}
            />
            {/* Core glowing orb */}
            <div 
              className="absolute w-[52%] h-[52%] rounded-full bg-gradient-to-tr from-primary to-secondary flex flex-col items-center justify-center text-white shadow-primary-glow border-4 border-white/20 animate-breathe cursor-pointer select-none"
              style={{ animationDelay: '1.6s' }}
            >
              <Heart className="w-7 h-7 mb-1 fill-white/20" />
              <span className="font-bold text-sm sm:text-base tracking-wide whitespace-nowrap">
                Hít vào… thở ra…
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
