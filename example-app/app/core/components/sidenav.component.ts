import { Component, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../reducers';
import * as LayoutActions from '../actions/layout.actions';

@Component({
  selector: 'bc-sidenav',
  template: `
    <mat-sidenav [opened]="open" (closedStart)="closeSidenav()">
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
  constructor(private store: Store<fromRoot.State>) {}

  closeSidenav() {
    this.store.dispatch(new LayoutActions.CloseSidenav());
  }
}
