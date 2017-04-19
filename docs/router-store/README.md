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

- Either a reducer or an effect can be invoked in response to this action. If the invoked reducer throws, the navigation will be canceled.
- If navigation gets canceled because of a guard, a ROUTER_CANCEL action will be dispatched.
- If navigation results in an error, a ROUTER_ERROR action will be dispatched.
- Both ROUTER_CANCEL and ROUTER_ERROR contain the store state before the navigation which can be used to restore the consistency of the store.

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
