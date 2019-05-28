---
# The documentation below is for NgRx versions 6.x and older.
# Visit https://ngrx.io for the latest documentation.
---

# @ngrx/router-store

Bindings to connect the Angular Router with @ngrx/store

### Installation

Install @ngrx/router-store from npm:

`npm install @ngrx/router-store --save` OR `yarn add @ngrx/router-store`

### Nightly builds

`npm install github:ngrx/router-store-builds` OR `yarn add github:ngrx/router-store-builds`

## Usage

@ngrx/router-store provides five navigation actions which are dispatched in a specific order. The `routerReducer` provided by @ngrx/router-store updates its state with the latest router state given by the actions.

#### Order of actions

Success case:

- `ROUTER_REQUEST`
- `ROUTER_NAVIGATION`
- `ROUTER_NAVIGATED`

Error / Cancel case (with early [Navigation Action Timing](./api.md#navigation-action-timing)):

- `ROUTER_REQUEST`
- `ROUTER_NAVIGATION`
- `ROUTER_CANCEL` / `ROUTER_ERROR`

Error / Cancel case (with late [Navigation Action Timing](./api.md#navigation-action-timing))

- `ROUTER_REQUEST`
- `ROUTER_CANCEL` / `ROUTER_ERROR`

##### ROUTER_REQUEST

At the start of each navigation, the router will dispatch a `ROUTER_REQUEST` action.

##### ROUTER_NAVIGATION

During navigation, before any guards or resolvers run, the router will dispatch a `ROUTER_NAVIGATION` action.

If you want the `ROUTER_NAVIGATION` to be dispatched after guards or resolvers run, change the [Navigation Action Timing](./api.md#navigation-action-timing).

##### ROUTER_NAVIGATED

After a successful navigation, the router will dispatch a `ROUTER_NAVIGATED` action.

##### ROUTER_CANCEL

When the navigation is cancelled, for example due to a guard saying that the user cannot access the requested page, the router will dispatch a `ROUTER_CANCEL` action.

The action contains the store state before the navigation. You can use it to restore the consistency of the store.

##### ROUTER_ERROR

When there is an error during navigation, the router will dispatch a `ROUTER_ERROR` action.

The action contains the store state before the navigation. You can use it to restore the consistency of the store.

## Setup

```ts
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({
      router: routerReducer,
    }),
    RouterModule.forRoot([
      // routes
    ]),
    // Connects RouterModule with StoreModule
    StoreRouterConnectingModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## API Documentation

- [Configuration Options](./api.md#configuration-options)
- [Custom Router State Serializer](./api.md#custom-router-state-serializer)
- [Navigation Action Timing](./api.md#navigation-action-timing)
