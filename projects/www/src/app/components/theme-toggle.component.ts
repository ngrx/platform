import { DOCUMENT } from '@angular/common';
import {
  Component,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  isDark = signal(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.document.body.classList.toggle('light-theme', !this.isDark());
        try {
          localStorage.setItem('ngrx-theme', this.isDark() ? 'dark' : 'light');
        } catch {
          // localStorage may be blocked
        }
      }
    });
  }

  private initializeTheme(): void {
    try {
      const stored = localStorage.getItem('ngrx-theme');
      if (stored) {
        this.isDark.set(stored === 'dark');
      } else {
        this.isDark.set(
          matchMedia?.('(prefers-color-scheme: dark)').matches ?? true
        );
      }
    } catch {
      this.isDark.set(true);
    }
  }

  toggle(): void {
    this.isDark.set(!this.isDark());
  }
}

@Component({
  selector: 'ngrx-theme-toggle',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button
      mat-icon-button
      type="button"
      (click)="themeService.toggle()"
      [title]="
        themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'
      "
    >
      <mat-icon>{{ themeService.isDark() ? 'light' : 'dark' }}_mode</mat-icon>
    </button>
  `,
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
