import { Component } from '@angular/core';
import { BackofficeShell } from '../../core/layout/backoffice-shell/backoffice-shell';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [BackofficeShell],
  template: `<app-backoffice-shell role="ADMIN" />`,
})
export class AdminShell {}
