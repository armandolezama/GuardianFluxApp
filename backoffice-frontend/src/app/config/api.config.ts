import { environment } from '../../environments/environment';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');  // quita slashes finales
}
export function resolveApiBaseUrl(): string {
  const envValue = (environment.apiBaseUrl ?? '').trim();

  if (!envValue || envValue === '__API_BASE_URL__') {
    throw new Error('API base URL no configurada correctamente');
  }

  return normalizeBaseUrl(envValue);
}

export const API_BASE_URL = resolveApiBaseUrl();
