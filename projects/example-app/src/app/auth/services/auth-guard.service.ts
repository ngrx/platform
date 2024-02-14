import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthApiActions } from '@example-app/auth/actions/auth-api.actions';
import * as fromAuth from '@example-app/auth/reducers';

export const authGuard = (): Observable<boolean> => {
  const store = inject(Store);

  return store.select(fromAuth.selectLoggedIn).pipe(
    map((authed) => {
      if (!authed) {
        store.dispatch(AuthApiActions.loginRedirect());
        return false;
      }

      return true;
    }),
    take(1)
  );
};
