import { environment } from '../../environments/environment';

function resolveApiBaseUrl(): string {
  const envUrl = environment.apiBaseUrl?.trim();

  // DEV
  if (!environment.production) {
    // Prioriza lo que haya en environment, si no, localhost
    return envUrl || 'http://localhost:3000';
  }

  // PROD
  if (envUrl) {
    // Si quisieras que Angular se conecte a una URL distinta
    // aunque conviva en el mismo origen, la puedes poner aquí.
    return envUrl;
  }

  // Si no definiste nada en env, toma el mismo origin
  // (útil si Nest sirve /api, /app-angular, /app-react en el mismo host).
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Fallback feo pero seguro si algo raro pasa (SSR, etc.)
  throw new Error('No se pudo resolver API_BASE_URL');
}

export const API_BASE_URL = resolveApiBaseUrl();
