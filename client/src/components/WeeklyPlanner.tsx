import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Calendar, Plus, Trash2, Sparkles, Clock, RotateCcw } from 'lucide-react';
import { PlannerItem } from '../types';

const STORAGE_KEY = 'tho_planner_weekly_session';

const DEFAULT_ITEMS: PlannerItem[] = [
  { id: '1', label: 'Ngủ đủ 7–8 tiếng mỗi đêm', days: [false, false, false, false, false, false, false] },
  { id: '2', label: 'Đi bộ / vận động nhẹ 15 phút', days: [false, false, false, false, false, false, false] },
  { id: '3', label: 'Tắt màn hình 30 phút trước khi ngủ', days: [false, false, false, false, false, false, false] },
  { id: '4', label: 'Gặp gỡ bạn bè / trò chuyện giải tỏa', days: [false, false, false, false, false, false, false] },
];

interface PlannerStorage {
  weekKey: string; // YYYY-MM-DD của Thứ Hai trong tuần
  items: PlannerItem[];
  updatedAt: number;
}

// Lấy ngày Thứ Hai của tuần hiện tại dạng YYYY-MM-DD
function getCurrentMondayKey(d = new Date()): string {
  const date = new Date(d);
  const day = date.getDay(); // 0 is Sunday, 1 is Monday...
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

// Lấy text hiển thị khoảng thời gian trong tuần
function getWeekRangeDisplay(d = new Date()): { rangeText: string; todayText: string; todayIdx: number } {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const pad = (n: number) => String(n).padStart(2, '0');
  const monStr = `${pad(monday.getDate())}/${pad(monday.getMonth() + 1)}`;
  const sunStr = `${pad(sunday.getDate())}/${pad(sunday.getMonth() + 1)}/${sunday.getFullYear()}`;

  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const todayText = dayNames[new Date().getDay()];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return {
    rangeText: `Tuần ${monStr} – ${sunStr}`,
    todayText,
    todayIdx,
  };
}

export const WeeklyPlanner: React.FC = () => {
  const weekInfo = getWeekRangeDisplay();

  // Khởi tạo state với logic tự động phát hiện tuần mới
  const [items, setItems] = useState<PlannerItem[]>(() => {
    try {
      const currentWeekKey = getCurrentMondayKey();
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Trường hợp người dùng có dữ liệu cùng tuần
        if (parsed.weekKey === currentWeekKey && Array.isArray(parsed.items)) {
          return parsed.items;
        }
        // Trường hợp sang tuần mới: GIỮ LẠI các thói quen (labels), chỉ RESET dấu tích (days)
        if (Array.isArray(parsed.items)) {
          return parsed.items.map((it: PlannerItem) => ({
            ...it,
            days: [false, false, false, false, false, false, false],
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ITEMS;
  });

  // Tự động lưu vào localStorage kèm weekKey
  useEffect(() => {
    try {
      const data: PlannerStorage = {
        weekKey: getCurrentMondayKey(),
        items,
        updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }, [items]);

  const handleToggleDay = (itemId: string, dayIdx: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newDays = [...item.days];
          newDays[dayIdx] = !newDays[dayIdx];
          return { ...item, days: newDays };
        }
        return item;
      })
    );
  };

  const handleUpdateLabel = (itemId: string, newLabel: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, label: newLabel } : item))
    );
  };

  const handleAddRow = () => {
    const newItem: PlannerItem = {
      id: Date.now().toString(),
      label: '',
      days: [false, false, false, false, false, false, false],
    };
    setItems((prev) => [...prev, newItem]);
    toast.success('Đã thêm một mục phục hồi mới!');
  };

  const handleDeleteRow = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.info('Đã xóa mục khỏi kế hoạch.');
  };

  // Làm mới tất cả dấu tích của tuần này (giữ nguyên danh sách thói quen)
  const handleResetCheckboxes = () => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        days: [false, false, false, false, false, false, false],
      }))
    );
    toast.success('Đã làm mới các dấu tích cho tuần này!');
  };

  const dayHeaders = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <section id="planner" className="py-20 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 mb-3">
            <Calendar className="w-3.5 h-3.5" /> Kế hoạch phục hồi tuần
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-body-text tracking-tight">
            Tuần này, bạn nạp năng lượng ở đâu?
          </h2>
          <p className="mt-3 text-base text-[#5A6A7D] leading-relaxed">
            Đánh dấu những việc giúp bạn tái tạo sức sống mỗi ngày. Dữ liệu được lưu an toàn trên trình duyệt và tự động làm mới vào mỗi sáng Thứ Hai.
          </p>

          {/* Badges hiển thị rõ khoảng thời gian của tuần và ngày hôm nay */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-700">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              <span>{weekInfo.rangeText}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Hôm nay: {weekInfo.todayText}</span>
            </span>
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-8">
          {/* DESKTOP VIEW: Bảng 7 cột đầy đủ, làm nổi bật cột ngày hôm nay */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black/10 text-xs font-bold text-[#8492A3] uppercase">
                  <th className="py-3 px-4 w-[40%]">Thói quen sạc pin</th>
                  {dayHeaders.map((d, dIdx) => {
                    const isToday = dIdx === weekInfo.todayIdx;
                    return (
                      <th
                        key={d}
                        className={`py-3 px-2 text-center w-[7%] transition-colors ${
                          isToday
                            ? 'bg-primary/10 text-primary rounded-t-xl font-extrabold'
                            : ''
                        }`}
                      >
                        <div>{d}</div>
                        {isToday && (
                          <span className="text-[9px] uppercase font-bold text-primary block leading-none mt-0.5 tracking-tighter">
                            Nay
                          </span>
                        )}
                      </th>
                    );
                  })}
                  <th className="py-3 px-2 w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-black/5 hover:bg-black/[0.01] transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleUpdateLabel(item.id, e.target.value)}
                        placeholder="Nhập thói quen nạp năng lượng..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-transparent hover:border-black/10 focus:border-secondary focus:bg-white focus:outline-none text-sm text-body-text transition-all font-medium"
                      />
                    </td>
                    {item.days.map((checked, dIdx) => {
                      const isToday = dIdx === weekInfo.todayIdx;
                      return (
                        <td
                          key={dIdx}
                          className={`py-3 px-2 text-center ${
                            isToday ? 'bg-primary/[0.03]' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleDay(item.id, dIdx)}
                            className="w-5 h-5 rounded accent-primary cursor-pointer transition-transform active:scale-90"
                            title={`${dayHeaders[dIdx]}: ${checked ? 'Đã hoàn thành' : 'Chưa hoàn thành'}`}
                          />
                        </td>
                      );
                    })}
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => handleDeleteRow(item.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-primary transition-colors"
                        title="Xóa thói quen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW: Dạng thẻ cho từng thói quen — KHÔNG CẦN CUỘN NGANG */}
          <div className="block md:hidden space-y-3.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateLabel(item.id, e.target.value)}
                    placeholder="Nhập thói quen nạp năng lượng..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/15 text-sm text-body-text outline-none font-medium transition-all"
                  />
                  <button
                    onClick={() => handleDeleteRow(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
                    title="Xóa thói quen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Hàng 7 nút ngày vừa khít màn hình điện thoại */}
                <div className="flex items-center justify-between gap-1">
                  {dayHeaders.map((d, dIdx) => {
                    const isChecked = item.days[dIdx];
                    const isToday = dIdx === weekInfo.todayIdx;
                    return (
                      <button
                        key={dIdx}
                        type="button"
                        onClick={() => handleToggleDay(item.id, dIdx)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 select-none ${
                          isChecked
                            ? 'bg-primary text-white shadow-xs scale-102 ring-2 ring-primary/20'
                            : isToday
                            ? 'bg-primary/10 text-primary border border-primary/30'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200/80 active:scale-95'
                        }`}
                      >
                        <span className="flex items-center gap-0.5">
                          {d}
                          {isToday && !isChecked && (
                            <span className="w-1 h-1 rounded-full bg-primary" />
                          )}
                        </span>
                        <span className="text-[10px] leading-none">
                          {isChecked ? '✓' : '•'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Bar: Gợi ý + Nút thêm việc + Nút làm mới tuần */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black/5">
            <span className="text-xs text-[#8492A3] flex items-center gap-1.5 text-center sm:text-left">
              <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" /> Ví dụ: ngủ đủ 8 tiếng, đi dạo 15 phút, uống đủ nước...
            </span>

            <div className="w-full sm:w-auto flex items-center justify-end gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleResetCheckboxes}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                title="Làm mới tất cả dấu tích của tuần này"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Làm mới tuần</span>
              </button>

              <button
                type="button"
                onClick={handleAddRow}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full font-bold text-xs bg-primary text-white shadow-primary-glow hover:bg-primary-hover active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm việc cần làm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
