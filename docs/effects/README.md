# @ngrx/effects

RxJS powered side effect model for @ngrx/store

@ngrx/effects provides an API to model event sources as actions. Effects:

- Listen for actions dispatched from @ngrx/store
- Isolate side effects from components, allowing for more _pure_ components that select state and dispatch actions
- Provide new sources of actions to reduce state based on external
interactions such as network requests, web socket messages and time-based events.

### Installation
Install @ngrx/effects from npm:

`npm install @ngrx/effects --save` OR `yarn add @ngrx/effects`


### Nightly builds

`npm install github:ngrx/effects-builds` OR `yarn add github:ngrx/effects-builds`

## Setup

Effects are injectable service classes that use two main APIs.

### Effect decorator

Use the `@Effect()` decorator to hint to @ngrx/effects observable side-effects
on the effects class. @ngrx/effects dispatches actions emitted by every decorated
effect to the store.

### Actions Observable

The `Actions` observable represents an observable of all actions dispatched to the
store. The `ofType` operator lets you filter for actions of a certain type in which you
want to use to perform a side effect.

## Example
1. Create an AuthEffects service that describes a source of login actions:

```ts
// ./effects/auth.ts
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AuthEffects {
  // Listen for the 'LOGIN' action
  @Effect() login$: Observable<Action> = this.actions$.ofType('LOGIN')
    // Map the payload into JSON to use as the request body
    .map(toPayload)
    .mergeMap(payload =>
      this.http.post('/auth', payload)
        // If successful, dispatch success action with result
        .map(data => ({ type: 'LOGIN_SUCCESS', payload: data }))
        // If request fails, dispatch failed action
        .catch(() => of({ type: 'LOGIN_FAILED' }))
    );

  constructor(
    private http: Http,
    private actions$: Actions
  ) {}      
}
```

2. Register the EffectsModule in your application root imports. This NgModule *must* be added to
your root `NgModule` for the effects providers to be registered and start when your application is loaded.

```ts
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './effects/auth';

@NgModule({
  imports: [
    EffectsModule.forRoot([AuthEffects])
  ]
})
export class AppModule {}
```

## Feature Modules

For feature modules, register your effects via `EffectsModule.forFeature` method in your module's `imports`:

```ts
import { EffectsModule } from '@ngrx/effects';
import { AdminEffects } from './effects/admin';

@NgModule({
  imports: [
    EffectsModule.forFeature([AdminEffects])
  ]
})
export class AdminModule {}
```

## API Documentation
- [Controlling Effects](./api.md#controlling-effects)
- [Filtering Actions](./api.md#oftype)
- [Non-dispatching effects](./api.md#non-dispatching-effects)
- [Utilities](./api.md#utilities)
- [Testing](./testing.md)
