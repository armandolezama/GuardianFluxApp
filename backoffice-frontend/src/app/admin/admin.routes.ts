import { Routes } from '@angular/router';
import { AdminShell } from './admin-shell/admin-shell';
import { Invitations } from './invitations/invitations';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminShell,
    children: [
      { path: 'invitations', component: Invitations },
      { path: '', redirectTo: 'invitations', pathMatch: 'full' },
    ],
  },
];
