# @ngrx/router-store

Bindings to connect the Angular Router with @ngrx/store

### Installation
Install @ngrx/router-store from npm:

`npm install @ngrx/router-store --save` OR `yarn add @ngrx/router-store`


### Nightly builds

`npm install github:ngrx/router-store-builds` OR `yarn add github:ngrx/router-store-builds`

## Usage

During the navigation, before any guards or resolvers run, the router will dispatch a `ROUTER_NAVIGATION` action, which has the signature `RouterNavigationAction`:

```ts
/**
 * Payload of ROUTER_NAVIGATION.
 */
export declare type RouterNavigationPayload<T> = {
    routerState: T;
    event: RoutesRecognized;
};
/**
 * An action dispatched when the router navigates.
 */
export declare type RouterNavigationAction<T = RouterStateSnapshot> = {
    type: typeof ROUTER_NAVIGATION;
    payload: RouterNavigationPayload<T>;
};
```

- Reducers receive this action. Throwing an error in the reducer cancels navigation.
- Effects can listen for this action.
- The `ROUTER_CANCEL` action represents a guard canceling navigation.
- A `ROUTER_ERROR` action represents a navigation error .
- `ROUTER_CANCEL` and `ROUTER_ERROR` contain the store state before the navigation. Use the previous state to restore the consistency of the store.

## Setup

```ts
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { App } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({ routerReducer: routerReducer }),
    RouterModule.forRoot([
      // routes
    ]),
    StoreRouterConnectingModule
  ],
  bootstrap: [App]
})
export class AppModule { }
```
### Navigation actions

Navigation actions are not provided as part of the router package. You provide your own
custom navigation actions that use the `Router` within effects to navigate.

```ts
import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const GO = '[Router] Go';
export const BACK = '[Router] Back';
export const FORWARD = '[Router] Forward';

export class Go implements Action {
  readonly type = GO;

  constructor(public payload: {
    path: any[];
    query?: object;
    extras?: NavigationExtras;
  }) {}
}

export class Back implements Action {
  readonly type = BACK;
}

export class Forward implements Action {
  readonly type = FORWARD;
}

export type Actions
  = Go
  | Back
  | Forward;
```

```ts
import * as RouterActions from './actions/router';

store.dispatch(new RouterActions.Go({
  path: ['/path', { routeParam: 1 }],
  query: { page: 1 },
  extras: { replaceUrl: false }
});

store.dispatch(new RouterActions.Back());

store.dispatch(new RouterActions.Forward());
```

```ts
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Effect, Actions } from '@ngrx/effects';
import * as RouterActions from './actions/router';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false })
  navigate$ = this.actions$.ofType(RouterActions.GO)
    .map((action: RouterActions.Go) => action.payload)
    .do(({ path, query: queryParams, extras})
      => this.router.navigate(path, { queryParams, ...extras }));

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$.ofType(RouterActions.BACK)
    .do(() => this.location.back());

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$.ofType(RouterActions.FORWARD)
    .do(() => this.location.forward());    

  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location
  ) {}
}
```
## API Documentation
- [Custom Router State Serializer](./api.md#custom-router-state-serializer)
