// src/auth/token.ts
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};
