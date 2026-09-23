import React from 'react';
import { MessageSquare } from 'lucide-react';

export const GoogleFormSection: React.FC = () => {
  return (
    <section id="form" className="py-20 relative z-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 mb-3">
          <MessageSquare className="w-3.5 h-3.5" /> Khảo sát &amp; đóng góp ý kiến
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-body-text tracking-tight">
          Giúp nhóm phát triển hiểu bạn hơn
        </h2>
        <p className="mt-3 text-base text-[#5A6A7D] leading-relaxed max-w-xl mx-auto">
          Vài phút góp ý của bạn sẽ giúp Thở ngày càng hoàn thiện và giúp ích cho nhiều bạn học sinh khác.
        </p>

        <div className="mt-8 rounded-3xl overflow-hidden shadow-soft-lg border border-black/10 bg-white">
          <iframe
            src="https://docs.google.com/forms/d/e/933KkALPQFv678Af7/viewform?embedded=true"
            title="Google Form khảo sát góp ý"
            className="w-full h-[750px] border-0 block"
          >
            Đang tải form khảo sát...
          </iframe>
        </div>
      </div>
    </section>
  );
};
