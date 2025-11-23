import { Component, inject, Input, OnChanges } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../.././auth/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ThemeService } from '../../theme/theme.service';

export type BackofficeRole = 'ADMIN' | 'MONITOR';

@Component({
  selector: 'app-backoffice-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatListModule, MatSidenavModule,
  ],
  templateUrl: './backoffice-shell.html',
  styleUrl: './backoffice-shell.scss',
})
export class BackofficeShell implements OnChanges {
  private auth = inject(AuthService);
  private themeSvc = inject(ThemeService);
  private router = inject(Router);

  @Input({ required: true }) role!: BackofficeRole;

  // ✅ propiedad estable
  menu: Array<{ label: string; path: string }> = [];

  ngOnChanges() {
    this.menu = this.role === 'ADMIN'
      ? [{ label: 'Invitations', path: '/admin/invitations' }]
      : [{ label: 'Movements', path: '/monitor/movements' }];
  }

  trackByPath = (_: number, item: { path: string }) => item.path;

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login'); // ✅ sin reload duro
  }

  toggleTheme() {
    this.themeSvc.toggle();
  }

  get themeMode() {
    return this.themeSvc.mode();
  }
}
