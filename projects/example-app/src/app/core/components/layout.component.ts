import { Component } from '@angular/core';
import { MaterialModule } from '@example-app/material';

@Component({
  standalone: true,
  selector: 'bc-layout',
  imports: [MaterialModule],
  template: `
    <mat-sidenav-container fullscreen>
      <ng-content></ng-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      mat-sidenav-container {
        background: rgba(0, 0, 0, 0.03);
      }
    `,
  ],
})
export class LayoutComponent {}
