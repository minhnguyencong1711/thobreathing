import React, { useState } from 'react';
import { Video, ExternalLink, RefreshCw } from 'lucide-react';

export const CalmingVideo: React.FC = () => {
  // Video thiền làm dịu 5 phút chính thức của dự án
  const videoId = 'inpok4MKVLM';
  const [key, setKey] = useState(0);

  return (
    <section id="video" className="py-20 relative z-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 mb-3">
          <Video className="w-3.5 h-3.5" /> Góc video làm dịu
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-body-text tracking-tight">
          Dành 5 phút để thở cùng bạn
        </h2>
        <p className="mt-3 text-base text-[#5A6A7D] leading-relaxed max-w-xl mx-auto">
          Một bài thiền ngắn với âm thanh dịu nhẹ giúp hạ nhịp tim và làm dịu tâm trí trước khi quay lại bàn học.
        </p>

        <div className="mt-8 relative pt-[56.25%] rounded-3xl overflow-hidden shadow-soft-lg border-2 border-white bg-black">
          <iframe
            key={key}
            className="absolute inset-0 w-full h-full border-0"
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title="Thiền giảm căng thẳng — 5-Minute Meditation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#8492A3]">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors py-1.5 px-4 rounded-full bg-white border border-black/10 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Tải lại video
          </button>

          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-secondary transition-colors py-1.5 px-4 rounded-full bg-white border border-black/10 shadow-sm"
          >
            <span>Xem trên YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
