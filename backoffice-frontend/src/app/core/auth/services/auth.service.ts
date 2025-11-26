import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../config/api.config';


type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
};

export type BackofficeRole = 'ADMIN' | 'MONITOR';

export type BackofficeUser = {
  id: string;
  name: string;
  email: string;
  roles: BackofficeRole[];
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = API_BASE_URL; // después lo movemos a environment

  // ✅ estado mínimo centralizado
  private _currentUser = signal<BackofficeUser | null>(null);

  currentUser = computed(() => this._currentUser());
  role = computed<BackofficeRole | null>(() => this._currentUser()?.roles?.[0] ?? null);
  isLoggedIn = computed(() => !!this._currentUser());

  constructor() {
    // ✅ intenta hidratar desde token al cargar app
    const payload = this.getPayload();
    if (payload?.user) {
      this._currentUser.set(payload.user);
    }
  }

  async login(email: string, password: string) {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, {
        email,
        password,
      }),
    );

    localStorage.setItem('token', res.accessToken);

    const user: BackofficeUser = {
      ...res.user,
      roles: (res.user.roles ?? []).filter(r => r === 'ADMIN' || r === 'MONITOR') as BackofficeRole[],
    };

    // ✅ set de estado
    this._currentUser.set(user);

    return {
      token: res.accessToken,
      user,
      roles: user.roles,
    };
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRoles(): BackofficeRole[] {
    const payload = this.getPayload();
    const roles = payload?.roles ?? payload?.user?.roles;
    return Array.isArray(roles)
      ? roles.filter((r: any) => r === 'ADMIN' || r === 'MONITOR')
      : [];
  }

  getPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) throw new Error('Malformed token');
      return JSON.parse(atob(payloadPart));
    } catch {
      this.logout();
      return null;
    }
  }

  isTokenValid(): boolean {
    const payload = this.getPayload();
    if (!payload) return false;

    const exp = payload.exp;
    if (typeof exp !== 'number') return false;

    const nowSec = Math.floor(Date.now() / 1000);
    if (exp <= nowSec) {
      this.logout();
      return false;
    }
    return true;
  }
}
