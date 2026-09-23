import axios from 'axios';
import { SurveySubmitData, SurveyResult, LiveStatsData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // Gửi bài khảo sát
  async submitSurvey(data: SurveySubmitData): Promise<SurveyResult> {
    const res = await apiClient.post<SurveyResult>('/surveys', data);
    return res.data;
  },

  // Lấy thống kê cộng đồng thời gian thực
  async getLiveStats(): Promise<LiveStatsData> {
    const res = await apiClient.get<LiveStatsData>('/surveys/stats');
    return res.data;
  },
};
