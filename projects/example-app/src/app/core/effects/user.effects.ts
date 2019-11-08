import { Injectable } from '@angular/core';

import { fromEvent, merge, timer } from 'rxjs';
import { map, switchMapTo } from 'rxjs/operators';

import { createEffect } from '@ngrx/effects';
import { UserActions } from '@example-app/core/actions';

@Injectable()
export class UserEffects {
  clicks$ = fromEvent(document, 'click');
  keys$ = fromEvent(document, 'keydown');
  mouse$ = fromEvent(document, 'mousemove');

  idle$ = createEffect(() =>
    merge(this.clicks$, this.keys$, this.mouse$).pipe(
      switchMapTo(timer(5 * 60 * 1000)), // 5 minute inactivity timeout
      map(() => UserActions.idleTimeout())
    )
  );
}
