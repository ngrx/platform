import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthActions } from '@example-app/auth/actions/auth.actions';
import * as fromAuth from '@example-app/auth/reducers';
import * as fromRoot from '@example-app/reducers';
import { LayoutActions } from '@example-app/core/actions/layout.actions';
import {
  LayoutComponent,
  NavItemComponent,
  SidenavComponent,
  ToolbarComponent,
} from '../components';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { selectShowSidenav } from '../reducers/layout.reducer';

@Component({
  standalone: true,
  selector: 'bc-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    AsyncPipe,
    RouterLink,
    LayoutComponent,
    SidenavComponent,
    NavItemComponent,
    ToolbarComponent,
  ],
  template: `
    <bc-layout>
      <bc-sidenav [open]="(showSidenav$ | async)!" (closeMenu)="closeSidenav()">
        @if (loggedIn$ | async) {
        <bc-nav-item
          (navigate)="closeSidenav()"
          routerLink="/"
          icon="book"
          hint="View your book collection"
        >
          My Collection
        </bc-nav-item>
        } @if (loggedIn$ | async) {
        <bc-nav-item
          (navigate)="closeSidenav()"
          routerLink="/books/find"
          icon="search"
          hint="Find your next book!"
        >
          Browse Books
        </bc-nav-item>
        } @if ((loggedIn$ | async) === false) {
        <bc-nav-item (navigate)="closeSidenav()"> Sign In </bc-nav-item>
        } @if (loggedIn$ | async) {
        <bc-nav-item (navigate)="logout()"> Sign Out </bc-nav-item>
        }
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
    this.showSidenav$ = this.store.select(selectShowSidenav);
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
