import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [RoleGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'monitor',
    canActivate: [RoleGuard],
    loadChildren: () =>
      import('./monitor/monitor.routes').then(m => m.MONITOR_ROUTES),
  },
  { path: '**', redirectTo: 'login' },
];
