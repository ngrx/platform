import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'bc-toolbar',
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="openMenu.emit()" aria-label="menu">
        <mat-icon>menu</mat-icon>
      </button>
      <ng-content></ng-content>
    </mat-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ToolbarComponent {
  @Output() openMenu = new EventEmitter<void>();
}
