import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  theme = signal<Theme>('dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.document.body.classList.toggle(
          'light-theme',
          this.theme() === 'light'
        );
        try {
          localStorage.setItem('ngrx-theme', this.theme());
        } catch {
          // localStorage may be blocked
        }
      }
    });
  }

  private initializeTheme(): void {
    try {
      const stored = localStorage.getItem('ngrx-theme') as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        this.theme.set(stored);
      } else {
        this.theme.set(
          matchMedia?.('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
        );
      }
    } catch {
      this.theme.set('dark');
    }
  }

  toggle(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }
}
