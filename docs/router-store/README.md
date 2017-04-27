# @ngrx/router-store

Bindings to connect the Angular Router with @ngrx/store

### Installation
Install @ngrx/router-store from npm:

```bash
npm install @ngrx/router-store --save
```

During the navigation, before any guards or resolvers run, the router will dispatch a ROUTER_NAVIGATION action, which has the following signature:

```ts
export type RouterNavigationPayload = {
  routerState: RouterStateSnapshot,
  event: RoutesRecognized
}
```

- Reducers recieve this action. Throwing an error in the reducer cancels navigation.
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
