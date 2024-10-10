import {
  Component,
  EventEmitter,
  input,
  Input,
  output,
  Output,
} from '@angular/core';
import { MaterialModule } from '@example-app/material';

@Component({
  standalone: true,
  selector: 'bc-sidenav',
  imports: [MaterialModule],
  template: `
    <mat-sidenav
      #sidenav
      [opened]="open()"
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
  open = input(false);
  closeMenu = output<void>();
}
