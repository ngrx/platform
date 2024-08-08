import { Component, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from '@example-app/material';

@Component({
  standalone: true,
  selector: 'bc-toolbar',
  imports: [MaterialModule],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="openMenu.emit()" aria-label="menu">
        <mat-icon>menu</mat-icon>
      </button>
      <ng-content></ng-content>
    </mat-toolbar>
  `,
})
export class ToolbarComponent {
  @Output() openMenu = new EventEmitter<void>();
}
