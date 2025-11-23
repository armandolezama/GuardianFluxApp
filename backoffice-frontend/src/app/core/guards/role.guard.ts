import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // decodifica payload simple (sin validar firma)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles: string[] = payload.roles ?? [];

    const isBackoffice = roles.includes('ADMIN') || roles.includes('MONITOR');
    if (!isBackoffice) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
