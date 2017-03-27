# StoreRouterConnectingModule


StoreRouterConnectingModule connects RouterModule with StoreModule.

During the navigation, before any guards or resolvers run, the router will dispatch a ROUTER_NAVIGATION action, which has the following signature:

```typescript
export type RouterNavigationPayload = {
  routerState: RouterStateSnapshot,
  event: RoutesRecognized
}
```

* Either a reducer or an effect can be invoked in response to this action. If the invoked reducer throws, the navigation will be canceled.
* If navigation gets canceled because of a guard, a ROUTER_CANCEL action will be dispatched.
* If navigation results in an error, a ROUTER_ERROR action will be dispatched.
* Both ROUTER_CANCEL and ROUTER_ERROR contain the store state before the navigation which can be used to restore the consistency of the store.

## Usage

```typescript

function routerReducer(state = "", action: any) {
  if (action.type === "ROUTER_NAVIGATION") {
    const s: RouterStateSnapshot = action.payload.routerState;
    return s.url.toString();
  } else {
    return state;
  }
}

@NgModule({
  declarations: [AppCmp, SimpleCmp],
  imports: [
    BrowserModule,
    StoreModule.provideStore({router: routerReducer}),
    RouterModule.forRoot([
      { path: '', component: SimpleCmp },
      { path: 'next', component: SimpleCmp }
    ]),
    StoreRouterConnectingModule
  ],
  bootstrap: [AppCmp]
})
export class AppModule {
}
```