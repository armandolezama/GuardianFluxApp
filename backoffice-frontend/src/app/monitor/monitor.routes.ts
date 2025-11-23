import { Routes } from '@angular/router';
import { MonitorShell } from './monitor-shell/monitor-shell';
import { Movements } from './movements/movements';

export const MONITOR_ROUTES: Routes = [
  {
    path: '',
    component: MonitorShell,
    children: [
      { path: 'movements', component: Movements },
//      { path: '', redirectTo: 'movements', pathMatch: 'full' },
    ],
  },
];
