// src/config/api.ts
const DEV_FALLBACK = 'http://localhost:3000';
const PROD_FALLBACK = 'https://guardianfluxapp.onrender.com';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV ? DEV_FALLBACK : PROD_FALLBACK);
