import {
  Component,
  Input,
  Output,
  EventEmitter,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '@example-app/material';

@Component({
  standalone: true,
  selector: 'bc-nav-item',
  imports: [MaterialModule, RouterLink],
  template: `
    <a mat-list-item [routerLink]="routerLink()" (click)="navigate.emit()">
      <mat-icon matListItemIcon>{{ icon() }}</mat-icon>
      <div matListItemTitle><ng-content></ng-content></div>
      @if (hint()) {
      <div matListItemLine>{{ hint() }}</div>
      }
    </a>
  `,
  styles: [
    `
      a:hover {
        cursor: pointer;
      }
    `,
  ],
})
export class NavItemComponent {
  icon = input('');
  hint = input('');
  routerLink = input<string | unknown[]>('/');

  navigate = output<void>();
}
