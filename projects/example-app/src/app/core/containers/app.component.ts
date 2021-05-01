import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthActions } from '@example-app/auth/actions';
import * as fromAuth from '@example-app/auth/reducers';
import * as fromRoot from '@example-app/reducers';
import { LayoutActions } from '@example-app/core/actions';

@Component({
  selector: 'bc-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-layout>
      <bc-sidenav [open]="showSidenav$ | async" (closeMenu)="closeSidenav()">
        <bc-nav-item
          (navigate)="closeSidenav()"
          *ngIf="loggedIn$ | async"
          routerLink="/"
          icon="book"
          hint="View your book collection"
        >
          My Collection
        </bc-nav-item>
        <bc-nav-item
          (navigate)="closeSidenav()"
          *ngIf="loggedIn$ | async"
          routerLink="/books/find"
          icon="search"
          hint="Find your next book!"
        >
          Browse Books
        </bc-nav-item>
        <bc-nav-item
          (navigate)="closeSidenav()"
          *ngIf="(loggedIn$ | async) === false"
        >
          Sign In
        </bc-nav-item>
        <bc-nav-item (navigate)="logout()" *ngIf="loggedIn$ | async">
          Sign Out
        </bc-nav-item>
      </bc-sidenav>
      <bc-toolbar (openMenu)="openSidenav()"> Book Collection </bc-toolbar>

      <router-outlet></router-outlet>
    </bc-layout>
  `,
})
export class AppComponent {
  showSidenav$: Observable<boolean>;
  loggedIn$: Observable<boolean>;

  constructor(private store: Store) {
    /**
     * Selectors can be applied with the `select` operator which passes the state
     * tree to the provided selector
     */
    this.showSidenav$ = this.store.select(fromRoot.selectShowSidenav);
    this.loggedIn$ = this.store.select(fromAuth.selectLoggedIn);
  }

  closeSidenav() {
    /**
     * All state updates are handled through dispatched actions in 'container'
     * components. This provides a clear, reproducible history of state
     * updates and user interaction through the life of our
     * application.
     */
    this.store.dispatch(LayoutActions.closeSidenav());
  }

  openSidenav() {
    this.store.dispatch(LayoutActions.openSidenav());
  }

  logout() {
    this.store.dispatch(AuthActions.logoutConfirmation());
  }
}
