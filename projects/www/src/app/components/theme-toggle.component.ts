import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'ngrx-theme-toggle',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      mat-icon-button
      type="button"
      (click)="themeService.toggle()"
      [title]="
        themeService.theme() === 'dark'
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      "
    >
      <mat-icon>
        {{ themeService.theme() === 'dark' ? 'light' : 'dark' }}_mode
      </mat-icon>
    </button>
  `,
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
