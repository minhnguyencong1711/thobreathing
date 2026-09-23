// Chatbot configuration constants — tối ưu token và rate limiting
export const CHATBOT_FULL_HISTORY_COUNT = 6; // số tin giữ nguyên full
export const CHATBOT_SUMMARY_HISTORY_COUNT = 30; // tổng tin fetch
export const CHATBOT_MAX_SUMMARY_CHARS = 3200; // ~800 tokens cho summary

export const CHATBOT_RATE_LIMIT_PER_MINUTE = 5; // max tin/phút/IP
export const CHATBOT_RATE_LIMIT_PER_DAY = 30; // max tin/ngày/IP

export const CHATBOT_MAX_INPUT_LENGTH = 500; // ký tự tối đa/tin
export const CHATBOT_MAX_OUTPUT_TOKENS = 512; // token output tối đa
export const CHATBOT_TEMPERATURE = 0.4;

export const CHATBOT_SESSION_TTL_DAYS = 30; // TTL MongoDB session
export const CHATBOT_SURVEY_TTL_DAYS = 7;  // TTL localStorage survey (thông báo user)

export const CHATBOT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
