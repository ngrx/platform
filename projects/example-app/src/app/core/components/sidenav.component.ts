import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'bc-sidenav',
  template: `
    <mat-sidenav
      #sidenav
      [opened]="open"
      (keydown.escape)="sidenav.close()"
      (closedStart)="closeMenu.emit()"
      disableClose
    >
      <mat-nav-list>
        <ng-content></ng-content>
      </mat-nav-list>
    </mat-sidenav>
  `,
  styles: [
    `
      mat-sidenav {
        width: 300px;
      }
    `,
  ],
})
export class SidenavComponent {
  @Input() open = false;
  @Output() closeMenu = new EventEmitter();
}
