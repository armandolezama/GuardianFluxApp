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
    const token = this.getToken();
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles ?? [];
    } catch {
      return [];
    }
  }
}
