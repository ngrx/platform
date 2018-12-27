# Lifecycle

### ROOT_EFFECTS_INIT

After all the root effects have been added, the root effect dispatches a `ROOT_EFFECTS_INIT` action.
You can see this action as a lifecycle hook, which you can use in order to execute some code after all your root effects have been added.

<code-example header="init.effects.ts">
@Effect()
init$ = this.actions$.pipe(
  ofType(ROOT_EFFECTS_INIT),
  map(action => ...)
);
</code-example>

### Non-dispatching Effects

Pass `{ dispatch: false }` to the decorator to prevent dispatching.

Sometimes you don't want effects to dispatch an action, for example when you only want to log or navigate. But when an effect does not dispatch another action, the browser will crash because the effect is both 'subscribing' to and 'dispatching' the exact same action, causing an infinite loop. To prevent this, add { dispatch: false } to the decorator.

Usage:

<code-example header="log.effects.ts">
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogEffects {
  constructor(private actions$: Actions) {}
  
  @Effect({ dispatch: false })
  logActions$ = this.actions$.pipe(tap(action => console.log(action)));
}
</code-example>

## Controlling Effects

### OnInitEffects

Implement this interface to dispatch a custom action after the effect has been added.
You can listen to this action in the rest of the application to execute something after the effect is registered.

Usage:

<code-example header="user.effects.ts">
class UserEffects implements OnInitEffects {
  ngrxOnInitEffects(): Action {
    return { type: '[UserEffects]: Init' };
  }
}
</code-example>

### OnRunEffects

By default, effects are merged and subscribed to the store. Implement the `OnRunEffects` interface to control the lifecycle of the resolved effects.

Usage:

<code-example header="user.effects.ts">
import { Injectable } from '@angular/core';
import {
  Actions,
  Effect,
  OnRunEffects,
  EffectNotification,
  ofType,
} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { exhaustMap, takeUntil, tap } from 'rxjs/operators';

@Injectable()
export class UserEffects implements OnRunEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  updateUser$: Observable&lt;Action&gt; = this.actions$.pipe(
    ofType('UPDATE_USER'),
    tap(action => {
      console.log(action);
    })
  );

  ngrxOnRunEffects(resolvedEffects$: Observable&lt;EffectNotification&gt;) {
    return this.actions$.pipe(
      ofType('LOGGED_IN'),
      exhaustMap(() =>
        resolvedEffects$.pipe(
          takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
        )
      )
    );
  }
}
</code-example>

### Identify Effects Uniquely

By default, each Effects class is registered once regardless of how many times the Effect class is loaded.
By implementing this interface, you define a unique identifier to register an Effects class instance multiple times.

Usage:

<code-example header="user.effects.ts">
class EffectWithIdentifier implements OnIdentifyEffects {
  constructor(private effectIdentifier: string) {}

  ngrxOnIdentifyEffects() {
    return this.effectIdentifier;
  }
}
</code-example>
