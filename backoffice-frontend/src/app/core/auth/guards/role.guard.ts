import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (!this.auth.isTokenValid()) {
      return this.router.parseUrl('/login');
    }

    const roles = this.auth.getRoles();
    const ok = roles.includes('ADMIN') || roles.includes('MONITOR');
    return ok ? true : this.router.parseUrl('/login');
  }

}
