import { Injectable, signal, inject, NgZone } from '@angular/core';

export type ThemeMode = 'light' | 'dark';
const STORAGE_KEY = 'gf-backoffice-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private zone = inject(NgZone);

  mode = signal<ThemeMode>(this.getInitialMode());

  constructor() {
    this.apply(this.mode());
  }

  toggle() {
    const next: ThemeMode = this.mode() === 'light' ? 'dark' : 'light';
    this.set(next);
  }

  set(mode: ThemeMode) {
    this.mode.set(mode);
    localStorage.setItem(STORAGE_KEY, mode);
    this.apply(mode);
  }

  private apply(mode: ThemeMode) {
    this.zone.runOutsideAngular(() => {
      const html = document.documentElement;
      html.classList.remove('theme-light', 'theme-dark');
      html.classList.add(`theme-${mode}`);
      html.style.colorScheme = mode;
    });
  }

  private getInitialMode(): ThemeMode {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') return saved;

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}
