import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { of } from 'rxjs';
import { concatMap, map, tap, withLatestFrom } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';

import * as fromRoot from '@example-app/reducers';

@Injectable()
export class RouterEffects {
  updateTitle$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        concatMap((action) =>
          of(action).pipe(
            withLatestFrom(this.store.select(fromRoot.selectRouteData))
          )
        ),
        map(([, data]) => `Book Collection - ${data['title']}`),
        tap((title) => this.titleService.setTitle(title))
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromRoot.State>,
    private titleService: Title
  ) {}
}
