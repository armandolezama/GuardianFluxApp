import { Routes } from '@angular/router';
import { RoleGuard } from './core/auth/guards/role.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent) },

  { 
    path: 'admin', 
    canActivate: [RoleGuard],
    loadChildren: () => 
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { path: 'monitor', canActivate: [RoleGuard], loadChildren: () => import('./monitor/monitor.routes').then(m => m.MONITOR_ROUTES) },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
