import { Component } from '@angular/core';

@Component({
  selector: 'bc-layout',
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

    *, /deep/ * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `,
  ],
})
export class LayoutComponent {}
