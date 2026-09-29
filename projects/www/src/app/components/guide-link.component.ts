import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'ngrx-guide-menu-link',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <a
      [routerLink]="url()"
      routerLinkActive="active"
      [routerLinkActiveOptions]="{ exact: true }"
    >
      <ng-content></ng-content>
    </a>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      a {
        display: block;
        color: var(--ngrx-text-muted);
        transition: color 0.2s;
        font-size: 14px;
      }

      a.active,
      a:hover {
        color: var(--ngrx-text-primary);
      }
    `,
  ],
})
export class GuideMenuLinkComponent {
  url = input.required<string>();
}
