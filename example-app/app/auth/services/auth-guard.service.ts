import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as Auth from '../actions/auth';
import * as fromAuth from '../reducers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromAuth.State>) {}

  canActivate(): Observable<boolean> {
    return this.store
      .select(fromAuth.getLoggedIn)
      .map(authed => {
        if (!authed) {
          this.store.dispatch(new Auth.LoginRedirect());
          return false;
        }

        return true;
      })
      .take(1);
  }
}
