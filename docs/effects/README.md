# @ngrx/effects

> RxJS powered side effect model for `@ngrx/store`

## Introduction

NgRx Effects is what binds the outside world to the store, it allows you to:

- Isolate side effects into its own model
- Decouple components from side effects
- Listen to the store's `Actions` stream
- Compose and cancel async actions
- Dispatch new actions to the store

## Installation

`@ngrx/effects` is available on npm and can be installed with:

```bash
npm install @ngrx/effects
```

### Nightly builds

To install `@ngrx/effects` from the nightly builds:

```bash
npm install github:ngrx/effects-builds
```

## Effects in the NgRx flow

When an action gets dispatched it runs through every (loaded) reducer in the application.
After the reducers, the action loops through the all the registered effects. When an effect emits a new action,
`@ngrx/effects` dispatches the emitted action via the normal `store.dispatch(action)` function, restarting the whole cycle.

## Basics

Effects are defined in injectable classes and by using the `@Effect({ dispatch: boolean })` decorator on its properties.
A typical effect hooks into the `Actions` stream, listens for a specific action, executes a side effect, and dispatches a new action.
Because the `Actions` stream is a RxJS Observable, we can use the RxJS operators and patterns to achieve a desired result.
The only requirement is that the stream ends with an action.

Here's an example effect that listens for `PING` action types, performs a side effect by logging the ping, and emits a new `PONG` action:

```ts
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

@Injectable()
export class PingPongEffects {
  @Effect()
  ping$: Observable<Action> = this.actions$.pipe(
    ofType('PING'),
    tap(() => console.log('PING'))),
    map({ type: 'PONG' })
  );

  constructor(private actions$: Actions) {}
}
```

### `Actions`

`Actions` represents an `Observable<Action>` stream and emits a new value for every action that is dispatched with the `store.dispatch()` function.

### `ofType`

By using the pipeable `ofType` operator, we can filter a specific action type on the `Actions` stream in order to perform our side effect.

To listen for multiple action types at once, define the action types as followed:

```ts
ofType('PING', 'PONG');
```

The `ofType` operator can be seen as a simple `filter` RxJS operator:

```ts
filter(action => ['PING', 'PING'].some(type => type === action.type));
```

## Set up: registering Effects

### Root Effects

Just like it's necessary to use `StoreModule.forRoot()` to register the store module, it's also necessary to
to register the effects module with `EffectsModule.forRoot()`. This is required once in the application and is usually done in the root module, even if there are no effects available in the root module. This is because via the `EffectsModule.forRoot()` function, `@ngrx/effects` bootstraps its services needed in order to observe and dispatch actions. When an effect class is registered, `@ngrx/effects` subscribes to all of the properties decorated with `@Effect()`.

```ts
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [EffectsModule.forRoot([FirstEffectsClass, SecondEffectsClass])],
})
export class AppModule {}
```

If there are no effects in the root module, you can pass an empty effects array:

```ts
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [EffectsModule.forRoot([])],
})
export class AppModule {}
```

### Feature Effects

To register effects in other modules outside of the root module, use `EffectsModule.forFeature()`.

**Note**: Running an effects class multiple times, either by `forRoot()` or `forFeature()` (for example via different lazy loaded modules), will not cause effects to run multiple times. There is no functional difference between effects loaded by `forRoot()` and `forFeature()`, the important difference between the functions is that `forRoot()` sets up the providers required for effects.

```ts
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      FirstFeatureEffectsClass,
      SecondFeatureEffectsClass,
    ]),
  ],
})
export class FeatureModule {}
```

## Real world usages

### Requesting data from a HTTP service

When a service is being invoked it's important to catch errors coming from the service directly on the service stream. Otherwise
the `Actions` stream receives an error notification, which will terminate the effect steam. When this happens the effect
won't receive any new actions.

```ts
@Injectable()
export class CustomersEffects {
  @Effect()
  fetch: Observable<Action> = this.actions$.pipe(
    ofType(CustomerActionTypes.CUSTOMER_FETCH),
    exhaustMap(action =>
      this.customersService.fetchCustomers().pipe(
        map(customers => new CustomersFetchSuccess(customers)),
        catchError(err => new CustomersFetchFailed())
      )
    )
  );

  constructor(
    private actions$: Actions,
    private customersService: CustomersService
  ) {}
}
```

### Using RxJS

Because we're just subscribing to a RxJS Observable, we can make fully use of the power that RxJS brings.

```ts
@Injectable()
export class CustomersEffects {
  @Effect()
  query: Observable<Action> = this.actions$.pipe(
    ofType(CustomerActionTypes.CUSTOMER_FETCH),
    debounceTime(500),
    map(({ payload }) => payload),
    distinctUntilChanged(1000),
    switchMap(q =>
      this.customersService.queryCustomers(q).pipe(
        map(customers => new CustomersQuerySuccess(customers)),
        catchError(err => new CustomersQueryFailed())
      )
    )
  );

  constructor(
    private actions$: Actions,
    private customersService: CustomersService
  ) {}
}
```

## Non-dispatching Effects

By default `@ngrx/effects` dispatches the last action on the stream back to the store.
Sometimes this might not be desired and would lead to an infinite loop because the effect is both subscribing and dispatching the same action. To solve this, use the overload `@Effect({ dispatch: false })` while declaring the effect.

For example, redirect a user to the home page when she logs out:

```ts
@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType('LOGOUT'),
    tap(() => this.router.navigate('/home'))
  );

  constructor(private actions$: Actions, private router: Router) {}
}
```

## Lifecycle

### Initialize hook

After all the root effects are registered, `@ngrx/effects` dispatches a `ROOT_EFFECTS_INIT` action. The `ROOT_EFFECTS_INIT` action is only dispatched once during an applications lifetime.

This action can be used to execute a side effect after the effects are set up, for example:

```ts
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';

@Injectable()
export class UserEffects {
  @Effect()
  init$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    mapTo(new LoadUserSettings());
  );

  constructor(private actions$: Actions) {}
}
```

### Update hook

Whenever effects are registered with `EffectsModule.forFeature()`, `@ngrx/effects` dispatches a `UPDATE_EFFECTS` action after all of the effects are loaded. It can be compared to the `ROOT_EFFECTS_INIT` action but this action will be dispatched multiple times, every time new effect(s) are registered. The action has the name of the registered effects classes in a string array as its payload.
To perform a side effect when an effect class is registered, use this payload to filter the effect classes.

```ts
import { UPDATE_EFFECTS } from '@ngrx/effects';

@Injectable()
export class UserEffects {
  @Effect()
  init$ = this.actions$.pipe(
    ofType(UPDATE_EFFECTS),
    filter(action => action.effects.includes('UserEffects')),
    mapTo(new LoadUserSettings());
  );

  constructor(private actions$: Actions) {}
}
```

### OnRunEffects

TK
By default, effects are merged and subscribed to the store. Implement the `OnRunEffects` interface to control the lifecycle of the resolved effects.

Usage:

```ts
import { EffectNotification } from '@ngrx/effects';

@Injectable()
export class UserEffects implements OnRunEffects {
  @Effect()
  updateUser$: Observable<Action> = this.actions$.pipe(
    ofType('UPDATE_USER'),
    tap(action => console.log(action))
  );

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.actions$.pipe(
      ofType('LOGGED_IN'),
      exhaustMap(() =>
        resolvedEffects$.pipe(
          takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
        )
      )
    );
  }

  constructor(private actions$: Actions) {}
}
```

## Utilities

### `mergeEffects`

TK
Manually merges all decorated effects into a combined observable.

Usage:

```ts
import { mergeEffects } from '@ngrx/effects';

export class MyService {
  constructor(effects: SomeEffectsClass) {
    mergeEffects(effects).subscribe(result => {
      console.log(result);
    });
  }
}
```

## More usages

### External sources

### Dispatching multiple actions

To dispatch multiple actions inside an effect, we can make use again of the RxJS operators.
This time we're using the `concatMap` operator to return an "inner" Observable.

```ts
@Effect()
insert$ = this.actions$.pipe(
  ofType(CustomerActionTypes.NewCustomer),
  concatMap(({ payload }) => this.customersService.insertCustomer(payload).pipe(
    concatMap(result => [
      new CustomersInsertSuccess(result),
      new ShowNotification('Customer successfully created'),
    ]),
    catchError(err => of(new BooksApiActions.CustomersInsertFailed(err)))
  ));
);
```

All the examples we've seen so far are using the `Actions` stream as source, but it's also possible to use an other source.
The only requirement is that the source has to be a RxJS Observable.

An example can be the RxJS `interval` Observable to execute a side effect or dispatch an action every second:

```ts
@Effect()
ping$ = interval(1000).pipe(mapTo(new Ping()));
```

Another example is to use the RxJS `fromEvent` function to keep track of the user's mouse location:

```ts
@Effect()
mouseMove$ = fromEvent(window, 'mousemove').pipe(
  auditTime(16),
  map(event => new MouseMove(event.clientX, event.clientY))
);
```

### Handling UI interaction

A powerful usage of `@ngrx/effects` is that it can handle a part of the UI flow.
Doing this decouples your components from your side effects.
This has the benefit that your components become more pure, making them easier to test.

An example is knowing when to open and close a dialog:

```ts
@Effect()
openDialog$ = this.actions$.pipe(
  ofType(LoginActionTypes.OpenLoginDialog),
  exhaustMap(() => {
    let dialogRef = this.dialog.open(LoginDialog);
    return dialogRef.afterClosed();
  }),
  map(result => result ? new LoginDialogSuccess(result) : new CloseDialog())
);
```

### Reading slices of the store state

To read a slice of the store state within an effect, use the RxJS `withLatestFrom` operator.

```ts
@Effect()
insert$ = this.actions$.pipe(
  ofType(CustomerActionTypes.NewCustomer),
  withLatestFrom(this.store.select(getUser)),
  concatMap(([{ payload }, user]) =>
    this.customersService.insertCustomer(payload, user).pipe(
      map(() => new CustomersInsertSuccess()),
      catchError(err => new CustomersInsertFailed())
    )
  )
);
```
