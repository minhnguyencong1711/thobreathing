import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Timer as TimerIcon, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'pomodoro' | 'fifty' | 'custom'>('pomodoro');
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [customWork, setCustomWork] = useState(30);
  const [customRest, setCustomRest] = useState(8);

  const getDuration = (m: 'pomodoro' | 'fifty' | 'custom', p: 'work' | 'rest') => {
    if (m === 'pomodoro') return p === 'work' ? 25 * 60 : 5 * 60;
    if (m === 'fifty') return p === 'work' ? 50 * 60 : 10 * 60;
    return p === 'work' ? customWork * 60 : customRest * 60;
  };

  const [remaining, setRemaining] = useState<number>(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRemaining(getDuration(mode, phase));
    setRunning(false);
  }, [mode, phase, customWork, customRest]);

  useEffect(() => {
    let interval: any = null;
    if (running) {
      interval = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            const nextPhase = phase === 'work' ? 'rest' : 'work';
            setPhase(nextPhase);
            if (nextPhase === 'rest') {
              toast.success('🎉 Chúc mừng bạn đã hoàn thành phiên học tập! Hãy đứng dậy vươn vai và nghỉ ngơi nhé.');
            } else {
              toast.info('⏰ Hết giờ nghỉ giải lao rồi! Cùng bắt đầu phiên học tập mới nhé.');
            }
            return getDuration(mode, nextPhase);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, phase, mode, customWork, customRest]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleReset = () => {
    setRunning(false);
    setRemaining(getDuration(mode, phase));
  };

  const handleSkip = () => {
    const nextPhase = phase === 'work' ? 'rest' : 'work';
    setPhase(nextPhase);
    setRemaining(getDuration(mode, nextPhase));
    setRunning(false);
  };

  return (
    <section id="timer" className="py-20 relative z-10">
      <div className="max-w-xl mx-auto px-6 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 mb-3">
          <TimerIcon className="w-3.5 h-3.5" /> Bấm giờ học tập
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-body-text tracking-tight">
          Học có nhịp, nghỉ có giờ
        </h2>
        <p className="mt-3 text-base text-[#5A6A7D] leading-relaxed">
          Chia nhỏ thời gian học giúp duy trì sự tập trung cao độ và bảo vệ não bộ khỏi kiệt sức.
        </p>

        {/* Timer Panel */}
        <div className="glass-panel p-8 sm:p-12 mt-8">
          {/* Mode Tabs */}
          <div className="flex p-1.5 rounded-full bg-black/5 max-w-sm mx-auto mb-8">
            <button
              onClick={() => { setMode('pomodoro'); setPhase('work'); }}
              className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                mode === 'pomodoro' ? 'bg-white text-body-text shadow-sm' : 'text-[#6A7889]'
              }`}
            >
              Pomodoro 25/5
            </button>
            <button
              onClick={() => { setMode('fifty'); setPhase('work'); }}
              className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                mode === 'fifty' ? 'bg-white text-body-text shadow-sm' : 'text-[#6A7889]'
              }`}
            >
              50/10
            </button>
            <button
              onClick={() => { setMode('custom'); setPhase('work'); }}
              className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                mode === 'custom' ? 'bg-white text-body-text shadow-sm' : 'text-[#6A7889]'
              }`}
            >
              Tuỳ chỉnh
            </button>
          </div>

          {/* Custom Inputs */}
          {mode === 'custom' && (
            <div className="flex justify-center gap-4 mb-6">
              <label className="text-xs font-bold text-[#6A7889] flex flex-col items-center gap-1">
                Học (phút):
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customWork}
                  onChange={(e) => setCustomWork(Math.max(1, Number(e.target.value)))}
                  className="w-20 px-2 py-1.5 text-center text-base font-bold rounded-xl border border-black/10 bg-white"
                />
              </label>
              <label className="text-xs font-bold text-[#6A7889] flex flex-col items-center gap-1">
                Nghỉ (phút):
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customRest}
                  onChange={(e) => setCustomRest(Math.max(1, Number(e.target.value)))}
                  className="w-20 px-2 py-1.5 text-center text-base font-bold rounded-xl border border-black/10 bg-white"
                />
              </label>
            </div>
          )}

          {/* Phase Badge */}
          <div className="text-sm font-bold tracking-widest text-primary uppercase">
            {phase === 'work' ? 'PHIÊN HỌC TẬP' : 'GIỜ NGHỈ GIẢI LAO'}
          </div>

          {/* Big Digital Display */}
          <div className="text-6xl sm:text-7xl font-extrabold text-body-text my-4 tabular-nums tracking-tighter">
            {formatTime(remaining)}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handleReset}
              className="w-14 h-14 rounded-full bg-white border border-black/10 text-body-text flex items-center justify-center shadow-sm hover:border-secondary hover:text-secondary transition-all"
              title="Đặt lại"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setRunning(!running)}
              className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-primary-glow hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all"
              title={running ? 'Tạm dừng' : 'Bắt đầu'}
            >
              {running ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
            </button>

            <button
              onClick={handleSkip}
              className="w-14 h-14 rounded-full bg-white border border-black/10 text-body-text flex items-center justify-center shadow-sm hover:border-secondary hover:text-secondary transition-all"
              title="Bỏ qua phiên"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
