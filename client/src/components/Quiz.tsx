import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { ClipboardCheck, ArrowRight, Sparkles, User, Calendar, AlertCircle, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import { SurveyResult } from '../types';

interface QuizProps {
  onSurveySubmitted: (result: SurveyResult, birthYear: number) => void;
  savedResult?: SurveyResult | null;
  savedBirthYear?: number;
  expirationText?: string;
  remainingDays?: number;
  onRetake?: () => void;
}

const QUESTIONS = [
  { t: 'ex', text: 'Bạn cảm thấy kiệt sức vì việc học.' },
  { t: 'ex', text: 'Bạn cảm thấy mệt mỏi ngay khi thức dậy và nghĩ đến một ngày học tập mới.' },
  { t: 'ex', text: 'Học cả ngày thực sự là điều rất căng thẳng đối với bạn.' },
  { t: 'ex', text: 'Bạn cảm thấy như đã "cháy sạch" năng lượng vì việc học.' },
  { t: 'ex', text: 'Bạn cảm thấy kiệt quệ về mặt tinh thần vì việc học.' },
  { t: 'cy', text: 'Bạn ngày càng mất hứng thú với việc học.' },
  { t: 'cy', text: 'Bạn ngày càng ít nhiệt tình với việc học hơn trước đây.' },
  { t: 'cy', text: 'Bạn hoài nghi về ý nghĩa thực sự của việc học đối với mình.' },
  { t: 'cy', text: 'Bạn thấy việc học ở trường không còn quan trọng với bạn nữa.' },
  { t: 'pe', text: 'Bạn có thể giải quyết hiệu quả các vấn đề nảy sinh trong việc học.' },
  { t: 'pe', text: 'Bạn cảm thấy mình đang đóng góp hiệu quả trong các buổi học/lớp học.' },
  { t: 'pe', text: 'Theo đánh giá của bạn, bạn là một học sinh khá giỏi.' },
  { t: 'pe', text: 'Bạn cảm thấy hứng thú khi hoàn thành tốt một nhiệm vụ học tập.' },
  { t: 'pe', text: 'Bạn đã học được nhiều điều thú vị trong quá trình học tập gần đây.' },
  { t: 'pe', text: 'Trong các buổi học, bạn tự tin rằng mình đang học hiệu quả.' },
];

const LIKERT_OPTIONS = [
  { value: 0, label: 'Không bao giờ' },
  { value: 1, label: 'Hiếm khi' },
  { value: 2, label: 'Thỉnh thoảng' },
  { value: 3, label: 'Đều đặn' },
  { value: 4, label: 'Thường xuyên' },
  { value: 5, label: 'Rất thường xuyên' },
  { value: 6, label: 'Hàng ngày' },
];

const LEVEL_CONFIG = [
  { label: 'Bình thường (An toàn) 🟢', color: '#2ECC71', desc: 'Các chỉ số của bạn đang ở ngưỡng cân bằng tốt. Hãy tiếp tục duy trì nhịp học – nghỉ ngơi hài hòa như hiện tại nhé!' },
  { label: 'Nguy cơ trung bình (Chớm quá tải) 🟡', color: '#F4B942', desc: 'Bạn đang có vài dấu hiệu chớm kiệt sức và căng thẳng. Đây là thời điểm vàng để điều chỉnh lại lịch sinh hoạt và dành thời gian sạc lại năng lượng.' },
  { label: 'Mức độ cao (Kiệt sức nghiêm trọng) 🔴', color: '#E63375', desc: 'Các chỉ số cho thấy bạn đang trong tình trạng kiệt sức đáng kể vì áp lực học tập. Hãy cho phép bản thân nghỉ ngơi ngay hôm nay và tìm kiếm sự chia sẻ từ thầy cô, cha mẹ hoặc chuyên viên tâm lý.' },
];

export const Quiz: React.FC<QuizProps> = ({
  onSurveySubmitted,
  savedResult,
  savedBirthYear,
  expirationText,
  remainingDays,
  onRetake,
}) => {
  const [name, setName] = useState(savedResult?.name || '');
  const [birthYearInput, setBirthYearInput] = useState(
    savedBirthYear ? String(savedBirthYear) : '2008',
  );
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SurveyResult | null>(savedResult || null);

  useEffect(() => {
    if (savedResult) {
      setResult(savedResult);
      if (savedResult.name) setName(savedResult.name);
    }
  }, [savedResult]);

  useEffect(() => {
    if (savedBirthYear) {
      setBirthYearInput(String(savedBirthYear));
    }
  }, [savedBirthYear]);

  const handleRetakeClick = () => {
    setResult(null);
    setAnswers({});
    if (onRetake) onRetake();
    toast.info('Bạn có thể làm lại bài kiểm tra');
    document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const parsedYear = parseInt(birthYearInput, 10);
  const isValidYear = birthYearInput.length === 4 && !isNaN(parsedYear) && parsedYear >= 1900 && parsedYear <= currentYear;
  const calculatedAge = isValidYear ? currentYear - parsedYear : null;

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / QUESTIONS.length) * 100);

  const handleBirthYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ cho phép nhập số, tối đa 4 chữ số
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setBirthYearInput(val);
  };

  const renderYearStatus = () => {
    if (birthYearInput.length === 0) return null;
    if (birthYearInput.length < 4) {
      return (
        <span className="text-[11px] font-medium text-gray-400 select-none">
          Nhập 4 số ({birthYearInput.length}/4)
        </span>
      );
    }
    if (isNaN(parsedYear) || parsedYear < 1900) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-600 select-none animate-in fade-in">
          ⚠️ Tối thiểu năm 1900
        </span>
      );
    }
    if (parsedYear > currentYear) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 select-none animate-in fade-in">
          ⚠️ Chưa tới năm {parsedYear}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-secondary/15 text-secondary flex items-center gap-1 select-none animate-in fade-in">
        🌱 {calculatedAge} tuổi
      </span>
    );
  };

  const handleSelectOption = (qIdx: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Vui lòng nhập tên hoặc biệt danh của bạn');
      document.getElementById('studentName')?.focus();
      return;
    }

    if (!isValidYear) {
      toast.error(`Năm sinh không hợp lệ. Vui lòng nhập năm từ 1900 đến ${currentYear}`);
      document.getElementById('studentBirthYear')?.focus();
      return;
    }

    if (answeredCount < QUESTIONS.length) {
      const missing = QUESTIONS.length - answeredCount;
      toast.warning(`Bạn còn ${missing} câu chưa hoàn thành. Hãy chọn đủ 15 câu để có kết quả chính xác nhất nhé!`);
      return;
    }

    const answersArray = QUESTIONS.map((_, i) => answers[i]);

    setLoading(true);
    const toastId = toast.loading('Đang phân tích chỉ số năng lượng của bạn...');

    try {
      const res = await api.submitSurvey({
        name: name.trim(),
        birthYear: parsedYear,
        answers: answersArray,
      });

      setResult(res);
      toast.success('Đã hoàn tất phân tích thành công!', { id: toastId });

      // Pháo hoa ăn mừng nhẹ nhàng
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.7 },
      });

      // Kích hoạt LiveStats và lưu session
      onSurveySubmitted(res, parsedYear);

      // Cuộn xuống kết quả
      setTimeout(() => {
        document.getElementById('quizResultSection')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      toast.error('Không thể gửi bài khảo sát. Vui lòng thử lại sau giây lát!', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="quiz" className="py-16 sm:py-24 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 mb-3">
            <ClipboardCheck className="w-3.5 h-3.5" /> Bài kiểm tra tâm lý
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-body-text tracking-tight">
            Mức độ Burnout của bạn đang ở đâu?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5A6A7D] leading-relaxed">
            15 câu hỏi dựa trên thang đo chuẩn <strong>MBI-SS</strong> (Maslach Burnout Inventory – Student Survey). Đo 3 khía cạnh: kiệt sức, thờ ơ và hiệu quả học tập.
          </p>
        </div>

        {/* Main Quiz Card */}
        <div className="glass-panel p-5 sm:p-10">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center text-xs font-bold text-[#8492A3] mb-2">
              <span>TIẾN ĐỘ HOÀN THÀNH</span>
              <span>{answeredCount} / {QUESTIONS.length} CÂU ({progressPct}%)</span>
            </div>
            <div className="h-2.5 w-full bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Student Info: Name & Birth Year with Dynamic Age */}
            <div className="p-4 sm:p-6 mb-8 rounded-2xl bg-[#F8F9FA] border border-black/5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="studentName" className="block text-xs font-bold text-body-text uppercase mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" /> Họ tên hoặc Biệt danh của bạn:
                </label>
                <input
                  id="studentName"
                  type="text"
                  placeholder="Ví dụ: Minh Châu, Hoàng Nam..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white text-sm text-body-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="studentBirthYear" className="block text-xs font-bold text-body-text uppercase mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-secondary" /> Năm sinh của bạn (4 số):
                </label>
                <div className="relative">
                  <input
                    id="studentBirthYear"
                    type="text"
                    inputMode="numeric"
                    placeholder="Ví dụ: 2008"
                    value={birthYearInput}
                    onChange={handleBirthYearChange}
                    className="w-full px-4 py-2.5 pr-28 rounded-xl border border-black/10 bg-white text-sm text-body-text focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                    required
                  />

                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {renderYearStatus()}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-8">
              {QUESTIONS.map((q, idx) => {
                const selectedVal = answers[idx];
                const selectedLabel = selectedVal !== undefined ? LIKERT_OPTIONS[selectedVal]?.label : null;

                return (
                  <div key={idx} className="pb-6 border-b border-black/5 last:border-b-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold tracking-wider text-secondary uppercase">
                        CÂU {idx + 1} / {QUESTIONS.length}
                      </span>
                      {selectedVal !== undefined && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary animate-in fade-in">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã chọn: {selectedVal} ({selectedLabel})
                        </span>
                      )}
                    </div>

                    <p className="text-base sm:text-lg font-semibold text-body-text mb-3 leading-snug">
                      {q.text}
                    </p>

                    {/* Scale Guide Hint on Mobile */}
                    <div className="flex justify-between items-center text-[11px] font-semibold text-[#8492A3] mb-2 sm:hidden px-0.5">
                      <span>0: Không bao giờ</span>
                      <span>6: Hàng ngày</span>
                    </div>

                    {/* Likert Scale Row: Clean & Responsive */}
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                      {LIKERT_OPTIONS.map((opt) => {
                        const isSelected = selectedVal === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelectOption(idx, opt.value)}
                            className={`py-2 sm:py-3 px-1 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20 scale-[1.03]'
                                : 'border-black/10 bg-white text-[#6A7889] hover:border-black/20 hover:bg-gray-50'
                            }`}
                          >
                            <span className={`text-base sm:text-lg font-extrabold ${isSelected ? 'text-primary' : 'text-body-text'}`}>
                              {opt.value}
                            </span>
                            {/* Desktop text label */}
                            <span className="hidden sm:block text-[11px] font-medium leading-tight mt-1 line-clamp-1">
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/10">
              <span className="text-xs text-[#8492A3] flex items-center gap-1.5 text-center sm:text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> Kết quả phục vụ nhận thức cá nhân, không thay thế chẩn đoán y khoa.
              </span>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-primary shadow-primary-glow hover:bg-primary-hover hover:-translate-y-0.5 disabled:opacity-50 transition-all flex-shrink-0"
              >
                <span>{loading ? 'Đang phân tích...' : 'Xem kết quả phân tích'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Result Section */}
          {result && (
            <div id="quizResultSection" className="mt-12 pt-8 border-t-2 border-black/10 animate-in fade-in duration-500">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="w-4 h-4" /> Kết quả của bạn ({result.name})
              </div>

              <h3 className="text-2xl font-extrabold text-body-text mt-2">
                {LEVEL_CONFIG[result.level]?.label}
              </h3>
              <p className="mt-2 text-[#5A6A7D] text-sm sm:text-base leading-relaxed">
                {LEVEL_CONFIG[result.level]?.desc}
              </p>

              {/* Dimension Bars */}
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1">
                    <span>Kiệt sức học tập (Exhaustion)</span>
                    <span className="font-bold text-primary">{result.scores.exhaustion} / 6</span>
                  </div>
                  <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${(result.scores.exhaustion / 6) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1">
                    <span>Thờ ơ / Hoài nghi (Cynicism)</span>
                    <span className="font-bold text-[#C62A63]">{result.scores.cynicism} / 6</span>
                  </div>
                  <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C62A63] rounded-full transition-all duration-1000"
                      style={{ width: `${(result.scores.cynicism / 6) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1">
                    <span>Hiệu quả học tập (Efficacy)</span>
                    <span className="font-bold text-secondary">{result.scores.efficacy} / 6</span>
                  </div>
                  <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-1000"
                      style={{ width: `${(result.scores.efficacy / 6) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Personalized Advice Box */}
              <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-secondary/10 border border-secondary/20">
                <h4 className="font-bold text-base text-secondary flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" /> {result.adviceTitle}
                </h4>
                <p className="text-sm sm:text-base text-body-text leading-relaxed">
                  {result.adviceBody}
                </p>
              </div>

              {/* Session Expiration & Retake Survey Action */}
              <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 text-xs text-body-text">
                  <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Hiệu lực kết quả: {expirationText || '7 ngày'} {remainingDays ? `(còn ${remainingDays} ngày)` : ''}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Trợ lý Thở AI sẽ sử dụng chỉ số này để tư vấn riêng cho bạn. Sau 7 ngày, hãy làm lại bài để theo dõi tiến độ hồi phục nhé!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRetakeClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all flex-shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Làm lại khảo sát
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
