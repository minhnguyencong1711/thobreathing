import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Wind, Heart, Play, Square, BookmarkCheck } from 'lucide-react';

const BREATH_STEPS = [
  { label: 'Hít vào (4s)', ms: 4000, scale: 1.35 },
  { label: 'Giữ hơi (7s)', ms: 7000, scale: 1.35 },
  { label: 'Thở ra (8s)', ms: 8000, scale: 0.78 },
];

const MOODS = [
  { id: 'great', emoji: '😄', label: 'Rất vui', tip: 'Tuyệt vời quá! Hãy nhớ lại điều gì đã giúp hôm nay của bạn tràn đầy năng lượng để tiếp tục duy trì nhé.' },
  { id: 'ok', emoji: '🙂', label: 'Ổn', tip: 'Cảm thấy "ổn" đã là một điều rất tốt rồi. Cho phép mình có những ngày bình thường, không cần lúc nào cũng phải xuất sắc.' },
  { id: 'meh', emoji: '😐', label: 'Bình thường', tip: 'Những ngày cảm xúc lưng chừng cũng rất đáng trân trọng. Sau giờ học, hãy thưởng cho mình một việc nhỏ bạn yêu thích.' },
  { id: 'tired', emoji: '😮‍💨', label: 'Mệt mỏi', tip: 'Cơ thể bạn đang gửi tín hiệu xin được nghỉ. Tối nay hãy ưu tiên ngủ sớm hơn 30 phút, một giấc ngủ sâu sẽ làm mới bạn.' },
  { id: 'down', emoji: '😞', label: 'Rất áp lực', tip: 'Cảm ơn bạn đã dũng cảm đối diện với cảm xúc. Bạn không hề đơn độc. Hãy thử hít thở sâu hoặc tâm sự với một người bạn tin tưởng nhé.' },
];

export const ReliefTools: React.FC = () => {
  // 4-7-8 Breathing State
  const [breathRunning, setBreathRunning] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (breathRunning) {
      const currentStep = BREATH_STEPS[stepIdx];
      timer = setTimeout(() => {
        if (stepIdx === BREATH_STEPS.length - 1) {
          if (cycle >= 3) {
            setBreathRunning(false);
            setStepIdx(0);
            setCycle(0);
            toast.success('🌿 Bạn đã hoàn thành trọn vẹn 4 chu kỳ hít thở 4-7-8!');
            return;
          }
          setCycle((c) => c + 1);
          setStepIdx(0);
        } else {
          setStepIdx((s) => s + 1);
        }
      }, currentStep.ms);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [breathRunning, stepIdx, cycle]);

  const handleStartBreathing = () => {
    setCycle(0);
    setStepIdx(0);
    setBreathRunning(true);
    toast.info('Bắt đầu nhịp thở: Hít vào bằng mũi sâu và đều...');
  };

  const handleStopBreathing = () => {
    setBreathRunning(false);
    setStepIdx(0);
  };

  // Mood Tracker State
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [activeTip, setActiveTip] = useState<string | null>(null);

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast.warning('Bạn hãy chọn một biểu tượng cảm xúc trước nhé!');
      return;
    }
    const found = MOODS.find((m) => m.id === selectedMood);
    if (found) {
      setActiveTip(found.tip);
      toast.success('Đã lưu lại cảm xúc hôm nay của bạn!');
      // Lưu LocalStorage
      try {
        const saved = JSON.parse(localStorage.getItem('tho_moods_react') || '[]');
        saved.push({ mood: selectedMood, note, timestamp: Date.now() });
        localStorage.setItem('tho_moods_react', JSON.stringify(saved.slice(-50)));
      } catch (e) {}
    }
  };

  return (
    <section id="relief" className="py-20 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 mb-3">
            <Wind className="w-3.5 h-3.5" /> Công cụ thư giãn nhanh
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-body-text tracking-tight">
            Chỉ cần 60 giây để bình tâm
          </h2>
          <p className="mt-3 text-base text-[#5A6A7D] leading-relaxed">
            Hai công cụ nhỏ giúp bạn lấy lại nhịp thở và nhận diện cảm xúc hiện tại của mình.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tool 1: 4-7-8 Breathing */}
          <div className="glass-panel p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-body-text flex items-center gap-2">
                <Wind className="w-5 h-5 text-primary" /> Hít thở 4‑7‑8
              </h3>
              <p className="mt-2 text-sm text-[#5A6A7D] leading-relaxed">
                Hít vào 4 giây, giữ hơi 7 giây, thở ra 8 giây. Lặp lại 4 vòng để kích hoạt hệ thần kinh phó giao cảm và giải tỏa căng thẳng ngay lập tức.
              </p>

              {/* Dynamic Circle Visual */}
              <div className="flex flex-col items-center justify-center my-10 min-h-[220px]">
                <div
                  className="w-40 h-40 rounded-full bg-gradient-to-tr from-primary to-secondary flex flex-col items-center justify-center text-white font-extrabold shadow-primary-glow transition-all ease-in-out select-none"
                  style={{
                    transitionDuration: breathRunning ? `${BREATH_STEPS[stepIdx].ms / 1000}s` : '0.6s',
                    transform: `scale(${breathRunning ? BREATH_STEPS[stepIdx].scale : 0.8})`,
                  }}
                >
                  <span className="text-lg">
                    {breathRunning ? BREATH_STEPS[stepIdx].label : 'Bắt đầu'}
                  </span>
                  {breathRunning && (
                    <span className="text-xs font-normal opacity-80 mt-1">
                      Vòng {cycle + 1} / 4
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              {!breathRunning ? (
                <button
                  onClick={handleStartBreathing}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-primary shadow-primary-glow hover:bg-primary-hover transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Bắt đầu hít thở</span>
                </button>
              ) : (
                <button
                  onClick={handleStopBreathing}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-body-text bg-white border border-black/10 hover:border-primary hover:text-primary transition-all"
                >
                  <Square className="w-4 h-4" />
                  <span>Dừng lại</span>
                </button>
              )}
            </div>
          </div>

          {/* Tool 2: Mood Tracker */}
          <div className="glass-panel p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-body-text flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" /> Nhật ký cảm xúc nhanh
              </h3>
              <p className="mt-2 text-sm text-[#5A6A7D] leading-relaxed">
                Hôm nay bạn đang cảm thấy thế nào trong lòng? Nhận diện cảm xúc là bước đầu tiên để chữa lành.
              </p>

              {/* Mood Buttons */}
              <div className="flex flex-wrap gap-3 my-6 justify-center">
                {MOODS.map((m) => {
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={`text-2xl p-3 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 scale-110 shadow-sm'
                          : 'border-black/10 bg-white hover:border-black/20 hover:-translate-y-0.5'
                      }`}
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  );
                })}
              </div>

              {/* Note input */}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Viết một câu chia sẻ về ngày hôm nay của bạn (không bắt buộc)..."
                className="w-full p-4 rounded-2xl border border-black/10 bg-white text-sm text-body-text focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all resize-none min-h-[90px]"
              />

              {/* Active Tip */}
              {activeTip && (
                <div className="mt-4 p-4 rounded-xl bg-primary/10 border-l-4 border-primary text-sm text-body-text animate-in fade-in duration-300">
                  {activeTip}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSaveMood}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-body-text bg-white border border-black/10 hover:border-secondary hover:text-secondary shadow-sm transition-all"
              >
                <BookmarkCheck className="w-4 h-4 text-primary" />
                <span>Lưu lại cảm xúc</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
