import { inject, Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);

  logger$ = createEffect(
    () => {
      return this.actions$.pipe(tap((action) => console.log(action)));
    },
    { dispatch: false }
  );
}
