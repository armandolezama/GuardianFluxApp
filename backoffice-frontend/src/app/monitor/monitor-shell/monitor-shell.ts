import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-monitor-shell',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './monitor-shell.html',
})
export class MonitorShell {}
