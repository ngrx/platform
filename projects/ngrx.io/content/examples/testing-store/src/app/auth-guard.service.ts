import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import * as fromAuth from './reducers';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromAuth.State>) {}

  canActivate() {
    return this.store.pipe(
      select(fromAuth.getLoggedIn),
      take(1)
    );
  }
}