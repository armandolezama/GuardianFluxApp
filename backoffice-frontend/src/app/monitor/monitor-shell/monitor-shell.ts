import { Component } from '@angular/core';
import { BackofficeShell } from '../../core/layout/backoffice-shell/backoffice-shell';

@Component({
  selector: 'app-monitor-shell',
  standalone: true,
  imports: [BackofficeShell],
  template: `<app-backoffice-shell role="MONITOR" />`,
})
export class MonitorShell {}
