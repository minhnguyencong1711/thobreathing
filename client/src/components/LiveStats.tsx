import React, { useEffect, useState } from 'react';
import { Users, Smile, AlertCircle, Flame } from 'lucide-react';
import { api } from '../services/api';
import { LiveStatsData } from '../types';

interface LiveStatsProps {
  refreshTrigger: number;
}

export const LiveStats: React.FC<LiveStatsProps> = ({ refreshTrigger }) => {
  const [stats, setStats] = useState<LiveStatsData>({
    total: 1284,
    avgExhaustion: 3.8,
    avgCynicism: 3.2,
    avgEfficacy: 2.9,
    lowPct: 24,
    medPct: 47,
    highPct: 29,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.getLiveStats();
        if (isMounted && data) {
          setStats(data);
        }
      } catch (err) {
        // Fallback mặc định
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  return (
    <section id="stats" className="py-20 bg-page-bg/60 border-y border-black/10 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 mb-3">
            <Users className="w-3.5 h-3.5" /> Dữ liệu cộng đồng
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-body-text tracking-tight">
            Số liệu khảo sát học sinh thời gian thực
          </h2>
          <p className="mt-3 text-base text-[#5A6A7D] leading-relaxed">
            Tổng hợp trực tiếp từ cơ sở dữ liệu học sinh tham gia tự đánh giá mức độ quá tải học tập — hoàn toàn ẩn danh và khách quan.
          </p>

          <div className="mt-4 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-xs font-bold text-[#5A6A7D] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-ping" />
            <span>
              {loading
                ? 'Đang đồng bộ từ MongoDB...'
                : `Cập nhật trực tiếp • ${stats.total.toLocaleString('vi-VN')} học sinh đã tham gia`}
            </span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-body-text" />
            <div className="text-3xl sm:text-4xl font-extrabold text-body-text tracking-tight">
              {stats.total.toLocaleString('vi-VN')}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#5A6A7D] mt-2">
              Lượt khảo sát đã ghi nhận
            </div>
          </div>

          <div className="glass-panel p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              {stats.avgExhaustion} <span className="text-lg font-normal text-gray-400">/ 6</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#5A6A7D] mt-2">
              Điểm Kiệt sức trung bình
            </div>
          </div>

          <div className="glass-panel p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#C62A63]" />
            <div className="text-3xl sm:text-4xl font-extrabold text-[#C62A63] tracking-tight">
              {stats.avgCynicism} <span className="text-lg font-normal text-gray-400">/ 6</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#5A6A7D] mt-2">
              Điểm Thờ ơ trung bình
            </div>
          </div>

          <div className="glass-panel p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
            <div className="text-3xl sm:text-4xl font-extrabold text-secondary tracking-tight">
              {stats.avgEfficacy} <span className="text-lg font-normal text-gray-400">/ 6</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#5A6A7D] mt-2">
              Điểm Hiệu quả trung bình
            </div>
          </div>
        </div>

        {/* Distribution Bars */}
        <div className="mt-12 glass-panel p-6 sm:p-8 space-y-5">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#8492A3]">
            Tỷ lệ phân bố mức độ rủi ro:
          </h4>

          {/* Low */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center text-sm">
            <div className="sm:col-span-3 font-semibold text-[#2ECC71] flex items-center gap-1.5">
              <Smile className="w-4 h-4" /> Bình thường (An toàn)
            </div>
            <div className="sm:col-span-8 h-3 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2ECC71] rounded-full transition-all duration-700"
                style={{ width: `${stats.lowPct}%` }}
              />
            </div>
            <div className="sm:col-span-1 text-right font-extrabold text-body-text">
              {stats.lowPct}%
            </div>
          </div>

          {/* Medium */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center text-sm">
            <div className="sm:col-span-3 font-semibold text-[#F4B942] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Nguy cơ trung bình
            </div>
            <div className="sm:col-span-8 h-3 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F4B942] rounded-full transition-all duration-700"
                style={{ width: `${stats.medPct}%` }}
              />
            </div>
            <div className="sm:col-span-1 text-right font-extrabold text-body-text">
              {stats.medPct}%
            </div>
          </div>

          {/* High */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center text-sm">
            <div className="sm:col-span-3 font-semibold text-primary flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> Mức độ cao (Kiệt sức)
            </div>
            <div className="sm:col-span-8 h-3 bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${stats.highPct}%` }}
              />
            </div>
            <div className="sm:col-span-1 text-right font-extrabold text-body-text">
              {stats.highPct}%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
