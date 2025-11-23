import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    const roles = this.auth.getRoles();
    const isBackoffice = roles.includes('ADMIN') || roles.includes('MONITOR');

    if (!isBackoffice) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
