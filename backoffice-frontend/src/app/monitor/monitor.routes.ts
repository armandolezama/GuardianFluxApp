import { Routes } from '@angular/router';
import { MonitorShell } from './monitor-shell/monitor-shell';
import { RoleGuard } from '../core/auth/guards/role.guard';
import { MONITOR_MOVEMENTS_PROVIDERS } from '../features/monitor-movements/monitor-movements.providers';

export const MONITOR_ROUTES: Routes = [
  {
    path: '',
    component: MonitorShell,
    children: [
      {
        path: 'movements',
        canActivate: [RoleGuard],
        providers: MONITOR_MOVEMENTS_PROVIDERS,
        loadComponent: () =>
          import('../features/monitor-movements/ui/movements.page')
            .then(m => m.MovementsPage),
        // opcional si ya extendiste RoleGuard con data.roles:
        data: { roles: ['MONITOR'] },
      },
      { path: '', redirectTo: 'movements', pathMatch: 'full' },
    ],
  },
];
