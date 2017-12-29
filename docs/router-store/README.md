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
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({ routerReducer: routerReducer }),
    RouterModule.forRoot([
      // routes
    ]),
    StoreRouterConnectingModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
## API Documentation
- [Navigation actions](./api.md#navigation-actions)
- [Effects](./api.md#effects)
- [Custom Router State Serializer](./api.md#custom-router-state-serializer)
