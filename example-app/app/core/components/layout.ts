import { Component } from '@angular/core';


@Component({
  selector: 'bc-layout',
  template: `
    <md-sidenav-container fullscreen>

      <ng-content></ng-content>

    </md-sidenav-container>
  `,
  styles: [`
    md-sidenav-container {
      background: rgba(0, 0, 0, 0.03);
    }

    *, /deep/ * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `]
})
export class LayoutComponent { }
