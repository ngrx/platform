import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '@example-app/material';

@Component({
  standalone: true,
  selector: 'bc-nav-item',
  imports: [MaterialModule, RouterLink, NgIf],
  template: `
    <a mat-list-item [routerLink]="routerLink" (click)="navigate.emit()">
      <mat-icon matListItemIcon>{{ icon }}</mat-icon>
      <div matListItemTitle><ng-content></ng-content></div>
      <div *ngIf="hint" matListItemLine>{{ hint }}</div>
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
  @Input() icon = '';
  @Input() hint = '';
  @Input() routerLink: string | any[] = '/';
  @Output() navigate = new EventEmitter<void>();
}
