export interface SurveyQuestion {
  index: number;
  type: 'ex' | 'cy' | 'pe';
  text: string;
}

export interface SurveySubmitData {
  name: string;
  birthYear: number;
  answers: number[];
}

export interface SurveyResult {
  id: string;
  name: string;
  scores: {
    exhaustion: number;
    cynicism: number;
    efficacy: number;
  };
  level: number; // 0: Normal, 1: Moderate, 2: High
  adviceTitle: string;
  adviceBody: string;
  createdAt: string;
}

export interface LiveStatsData {
  total: number;
  avgExhaustion: number;
  avgCynicism: number;
  avgEfficacy: number;
  lowPct: number;
  medPct: number;
  highPct: number;
}

export interface PlannerItem {
  id: string;
  label: string;
  days: boolean[];
}

export interface MoodLog {
  mood: 'great' | 'ok' | 'meh' | 'tired' | 'down';
  note: string;
  timestamp: number;
}
