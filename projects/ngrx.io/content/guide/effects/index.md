# Effects

RxJS powered side effect model for [Store](guide/store)

Effects provides an API to model event sources as actions. Effects:

- Listen for actions dispatched from [Store](guide/store).
- Isolate side effects from components, allowing for more _pure_ components that select state and dispatch actions.
- Provide [new sources](https://martinfowler.com/eaaDev/EventSourcing.html) of actions to reduce state based on external interactions such as network requests, web socket messages and time-based events.

### Installation

```sh
npm install @ngrx/effects --save
```

```sh
yarn add @ngrx/effects
```

## APIs

Effects are injectable service classes that use two main APIs.

### Effect decorator

The `Effect` decorator provides metadata to register observable side-effects in the effects class. Registered effects provide new actions provided by the source Observable to the store.

### Actions Observable

- Represents an observable of all actions dispatched to the store.
- Emits the latest action _after_ the action has passed through all reducers.
- The `ofType` operator lets you filter for actions of a certain type in which you want to use to perform a side effect.

## Setup

1.  Create an AuthEffects service that describes a source of login actions:

```ts
// ./effects/auth.effects.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  // Listen for the 'LOGIN' action
  @Effect()
  login$: Observable<Action> = this.actions$.pipe(
    ofType('LOGIN'),
    mergeMap(action =>
      this.http.post('/auth', action.payload).pipe(
        // If successful, dispatch success action with result
        map(data => ({ type: 'LOGIN_SUCCESS', payload: data })),
        // If request fails, dispatch failed action
        catchError(() => of({ type: 'LOGIN_FAILED' }))
      )
    )
  );

  constructor(private http: HttpClient, private actions$: Actions) {}
}
```

2.  Register the EffectsModule in your application root imports. This EffectsModule _must_ be added to
    your root `NgModule` for the effects providers to be registered and start when your application is loaded.

```ts
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './effects/auth.effects';

@NgModule({
  imports: [EffectsModule.forRoot([AuthEffects])],
})
export class AppModule {}
```

For feature modules, register your effects via `EffectsModule.forFeature` method in your module's `imports`:

```ts
import { EffectsModule } from '@ngrx/effects';
import { AdminEffects } from './effects/admin.effects';

@NgModule({
  imports: [EffectsModule.forFeature([AdminEffects])],
})
export class AdminModule {}
```
