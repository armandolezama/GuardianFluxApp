import { environment } from '../../environments/environment';

export function resolveApiBaseUrl(): string {
  const envValue = (environment.apiBaseUrl ?? '').trim();

  // 1) Si viene algo definido distinto al placeholder, úsalo
  if (envValue && envValue !== '__API_BASE_URL__') {
    return envValue;
  }

  // 2) Si no viene nada en env, asumimos mismo origin
  // (útil cuando backend y front están en el mismo dominio)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 3) Si estamos en un contexto raro (SSR, tests, etc.)
  throw new Error('No se pudo resolver API_BASE_URL');
}

export const API_BASE_URL = resolveApiBaseUrl();
