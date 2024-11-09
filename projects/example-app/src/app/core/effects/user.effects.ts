import { Injectable } from '@angular/core';

import { fromEvent, merge, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { createEffect } from '@ngrx/effects';
import { UserActions } from '@example-app/core/actions/user.actions';

@Injectable()
export class UserEffects {
  private readonly clicks$ = fromEvent(document, 'click');
  private readonly keys$ = fromEvent(document, 'keydown');
  private readonly mouse$ = fromEvent(document, 'mousemove');

  protected idle$ = createEffect(() =>
    merge(this.clicks$, this.keys$, this.mouse$).pipe(
      // 5 minute inactivity timeout
      switchMap(() => timer(5 * 60 * 1000)),
      map(() => UserActions.idleTimeout())
    )
  );
}
