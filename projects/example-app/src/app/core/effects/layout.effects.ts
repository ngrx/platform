import { Injectable } from '@angular/core';
import { AuthActions } from '@example-app/auth/actions';
import { LayoutActions } from '@example-app/core/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

@Injectable()
export class LayoutEffects {
  constructor(private actions$: Actions) {}

  logoutConfirmation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutConfirmation),
      map(() => LayoutActions.closeSidenav())
    )
  );
}
