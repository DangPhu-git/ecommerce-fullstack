export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const STORAGE_KEYS = {
  TOKEN: 'access_token',
  USER_INFO: 'user_info',
} as const;
