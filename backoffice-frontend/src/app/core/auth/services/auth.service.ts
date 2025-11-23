import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  async login(email: string, password: string) {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, {
        email,
        password,
      }),
    );

    localStorage.setItem('token', res.accessToken);

    return {
      token: res.accessToken,
      user: res.user,
      roles: res.user.roles,
    };
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRoles(): string[] {
    const payload = this.getPayload();
    const roles = payload?.roles;
    return Array.isArray(roles) ? roles : [];
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
