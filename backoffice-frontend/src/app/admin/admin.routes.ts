import { Routes } from '@angular/router';

import { ADMIN_INVITATIONS_PROVIDERS } from '../features/admin-invitations/admin-invitations.providers';
import { RoleGuard } from '../core/auth/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    // tu AdminShell ya envuelve layout
     loadComponent: () => import('./admin-shell/admin-shell').then(m => m.AdminShell),
    children: [
      {
        path: 'invitations',
        canActivate: [RoleGuard],
        providers: ADMIN_INVITATIONS_PROVIDERS,
        loadComponent: () =>
          import('../features/admin-invitations/ui/invitations.page')
            .then(m => m.InvitationsPage),
      },
      { path: '', redirectTo: 'invitations', pathMatch: 'full' },
    ],
  },
];

