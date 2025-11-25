// src/config/api.ts
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://api.guardianflux.com');
