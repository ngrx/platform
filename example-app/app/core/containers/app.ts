import 'rxjs/add/operator/let';
import { Observable } from 'rxjs/Observable';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../reducers';
import * as fromAuth from '../../auth/reducers';
import * as layout from '../actions/layout';
import * as Auth from '../../auth/actions/auth';

@Component({
  selector: 'bc-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-layout>
      <bc-sidenav [open]="showSidenav$ | async">
        <bc-nav-item (activate)="closeSidenav()" *ngIf="loggedIn$ | async" routerLink="/" icon="book" hint="View your book collection">
          My Collection
        </bc-nav-item>
        <bc-nav-item (activate)="closeSidenav()" *ngIf="loggedIn$ | async" routerLink="/books/find" icon="search" hint="Find your next book!">
          Browse Books
        </bc-nav-item>
        <bc-nav-item (activate)="closeSidenav()" *ngIf="!(loggedIn$ | async)">
          Sign In
        </bc-nav-item>        
        <bc-nav-item (activate)="logout()" *ngIf="loggedIn$ | async">
          Sign Out
        </bc-nav-item>
      </bc-sidenav>
      <bc-toolbar (openMenu)="openSidenav()">
        Book Collection
      </bc-toolbar>

      <router-outlet></router-outlet>
    </bc-layout>
  `,
})
export class AppComponent {
  showSidenav$: Observable<boolean>;
  loggedIn$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    /**
     * Selectors can be applied with the `select` operator which passes the state
     * tree to the provided selector
     */
    this.showSidenav$ = this.store.select(fromRoot.getShowSidenav);
    this.loggedIn$ = this.store.select(fromAuth.getLoggedIn);
  }

  closeSidenav() {
    /**
     * All state updates are handled through dispatched actions in 'container'
     * components. This provides a clear, reproducible history of state
     * updates and user interaction through the life of our
     * application.
     */
    this.store.dispatch(new layout.CloseSidenavAction());
  }

  openSidenav() {
    this.store.dispatch(new layout.OpenSidenavAction());
  }

  logout() {
    this.closeSidenav();

    this.store.dispatch(new Auth.Logout());
  }
}
