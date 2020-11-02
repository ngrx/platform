import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { filter, map, tap, withLatestFrom } from 'rxjs/operators';

import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromRoot from '@example-app/reducers';

@Injectable()
export class RouterEffects {
  updateTitle$ = createEffect(
    () =>
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        withLatestFrom(this.store.select(fromRoot.selectRouteData)),
        map(([, data]) => `Book Collection - ${data['title']}`),
        tap((title) => this.titleService.setTitle(title))
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private router: Router,
    private titleService: Title,
    private store: Store<fromRoot.State>
  ) {}
}
