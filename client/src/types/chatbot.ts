import { SurveyResult } from './index';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  createdAt?: string;
  isStreaming?: boolean;
}

export interface RateLimitInfo {
  usedToday: number;
  limitPerDay: number;
  remainingToday: number;
}

export interface SurveySessionData {
  result: SurveyResult;
  birthYear?: number;
  savedAt: number; // Unix timestamp ms
  expiresAt: number; // Unix timestamp ms (7 days)
}

export interface UserBurnoutContext {
  name: string;
  age: number;
  burnoutLevel: number;
  exhaustionScore: number;
  cynicismScore: number;
  efficacyScore: number;
}
