import { useState, useEffect, useCallback } from 'react';
import { SurveyResult } from '../types';
import { SurveySessionData } from '../types/chatbot';

const STORAGE_KEY = 'tho_survey_session';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function useSurveySession() {
  const [session, setSession] = useState<SurveySessionData | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data: SurveySessionData = JSON.parse(raw);
      // Kiểm tra nếu đã quá hạn 7 ngày
      if (Date.now() > data.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  });

  // Đồng bộ kiểm tra expiry định kỳ
  useEffect(() => {
    const checkExpiry = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setSession(null);
          return;
        }
        const data: SurveySessionData = JSON.parse(raw);
        if (Date.now() > data.expiresAt) {
          localStorage.removeItem(STORAGE_KEY);
          setSession(null);
        }
      } catch {
        setSession(null);
      }
    };

    const interval = setInterval(checkExpiry, 60000); // 1 phút check 1 lần
    return () => clearInterval(interval);
  }, []);

  const saveSession = useCallback((result: SurveyResult, birthYear?: number) => {
    const now = Date.now();
    const data: SurveySessionData = {
      result,
      birthYear,
      savedAt: now,
      expiresAt: now + SEVEN_DAYS_MS,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSession(data);
    } catch (e) {
      console.error('Failed to save survey session to localStorage', e);
    }
  }, []);

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
    } catch (e) {
      console.error('Failed to clear survey session', e);
    }
  }, []);

  // Tính toán thời gian hết hạn hiển thị rõ ràng trên UI
  const getExpirationInfo = useCallback(() => {
    if (!session) return null;

    const remainingMs = Math.max(0, session.expiresAt - Date.now());
    const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));

    const expDate = new Date(session.expiresAt);
    const formattedDate = expDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = expDate.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      expiresAtDate: `${formattedTime} ngày ${formattedDate}`,
      remainingDays,
      remainingHours,
      isExpired: remainingMs <= 0,
    };
  }, [session]);

  return {
    session,
    hasActiveSession: Boolean(session && session.expiresAt > Date.now()),
    saveSession,
    clearSession,
    expirationInfo: getExpirationInfo(),
  };
}
