import { Component, inject, Input } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

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
export class BackofficeShell {
  private auth = inject(AuthService);

  @Input({ required: true }) role!: BackofficeRole;

  logout() {
    this.auth.logout();
    location.href = '/login';
  }

  // Menú por rol (mínimo para Fase 0)
  get menu() {
    if (this.role === 'ADMIN') {
      return [
        { label: 'Invitations', path: '/admin/invitations' },
      ];
    }
    return [
      { label: 'Movements', path: '/monitor/movements' },
    ];
  }
}
