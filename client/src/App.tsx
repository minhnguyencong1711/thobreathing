import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Quiz } from './components/Quiz';
import { LiveStats } from './components/LiveStats';
import { PomodoroTimer } from './components/PomodoroTimer';
import { RelaxSpots } from './components/RelaxSpots';
import { CalmingVideo } from './components/CalmingVideo';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { ReliefTools } from './components/ReliefTools';
import { GoogleFormSection } from './components/GoogleFormSection';
import { Footer } from './components/Footer';
import { PosterModal } from './components/PosterModal';
import { ChatbotWidget } from './components/chatbot';
import { useSurveySession } from './hooks/useSurveySession';
import { SurveyResult } from './types';
import { UserBurnoutContext } from './types/chatbot';

export const App: React.FC = () => {
  const [posterOpen, setPosterOpen] = useState(false);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);

  const {
    session,
    hasActiveSession,
    saveSession,
    clearSession,
    expirationInfo,
  } = useSurveySession();

  const handleSurveySubmitted = (result: SurveyResult, birthYear: number) => {
    // Lưu session khảo sát vào localStorage (hạn 7 ngày)
    saveSession(result, birthYear);
    // Kích hoạt LiveStats lấy dữ liệu cập nhật mới nhất từ MongoDB
    setStatsRefreshTrigger((prev) => prev + 1);
  };

  // Chuẩn hóa burnout context để truyền vào Chatbot
  const userContext: UserBurnoutContext | undefined = session
    ? {
        name: session.result.name,
        age: session.birthYear ? new Date().getFullYear() - session.birthYear : 17,
        burnoutLevel: session.result.level,
        exhaustionScore: Math.round(session.result.scores.exhaustion * 5),
        cynicismScore: Math.round(session.result.scores.cynicism * 4),
        efficacyScore: Math.round(session.result.scores.efficacy * 6),
      }
    : undefined;

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden w-full max-w-full">
      {/* Sonner Toast Provider */}
      <Toaster position="top-right" richColors closeButton expand={false} />

      {/* Chill Ambient Breathing Glow Orbs 2 bên lề */}
      <AmbientBackground />

      {/* Main Single Page Layout */}
      <Navbar onOpenPoster={() => setPosterOpen(true)} />

      <main id="top" className="pt-20">
        <Hero onOpenPoster={() => setPosterOpen(true)} />
        <Quiz
          onSurveySubmitted={handleSurveySubmitted}
          savedResult={session?.result}
          savedBirthYear={session?.birthYear}
          expirationText={expirationInfo?.expiresAtDate}
          remainingDays={expirationInfo?.remainingDays}
          onRetake={clearSession}
        />
        <LiveStats refreshTrigger={statsRefreshTrigger} />
        <PomodoroTimer />
        <RelaxSpots />
        <CalmingVideo />
        <WeeklyPlanner />
        <ReliefTools />
        <GoogleFormSection />
      </main>

      <Footer onOpenPoster={() => setPosterOpen(true)} />

      {/* Poster Modal */}
      <PosterModal isOpen={posterOpen} onClose={() => setPosterOpen(false)} />

      {/* Thở AI Chatbot: Chỉ xuất hiện khi user đã có kết quả khảo sát MBI-SS còn hạn */}
      {hasActiveSession && (
        <ChatbotWidget
          userContext={userContext}
          expirationText={expirationInfo?.expiresAtDate}
          remainingDays={expirationInfo?.remainingDays}
        />
      )}
    </div>
  );
};

export default App;
