---
kind: ClassDeclaration
name: StoreRouterConnectingModule
module: router-store
---

# StoreRouterConnectingModule

## description

Connects RouterModule with StoreModule.

During the navigation, before any guards or resolvers run, the router will dispatch
a ROUTER_NAVIGATION action, which has the following signature:

```
export type RouterNavigationPayload = {
routerState: SerializedRouterStateSnapshot,
event: RoutesRecognized
}
```

Either a reducer or an effect can be invoked in response to this action.
If the invoked reducer throws, the navigation will be canceled.

If navigation gets canceled because of a guard, a ROUTER_CANCEL action will be
dispatched. If navigation results in an error, a ROUTER_ERROR action will be dispatched.

Both ROUTER_CANCEL and ROUTER_ERROR contain the store state before the navigation
which can be used to restore the consistency of the store.

Usage:

````typescript

```ts
class StoreRouterConnectingModule {
static forRoot<
T extends BaseRouterStoreState = SerializedRouterStateSnapshot
>(
config: StoreRouterConfig<T> = {}
): ModuleWithProviders<StoreRouterConnectingModule>;
}
````

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/router_store_module.ts#L151-L343)

## NgModule({

declarations: [AppCmp, SimpleCmp],
imports: [
BrowserModule,
StoreModule.forRoot(mapOfReducers),
RouterModule.forRoot([
{ path: '', component: SimpleCmp },
{ path: 'next', component: SimpleCmp }
]),
StoreRouterConnectingModule.forRoot()
],
bootstrap: [AppCmp]
})
export class AppModule {
}

````
## Methods
### forRoot
```ts
static forRoot<  T extends BaseRouterStoreState = SerializedRouterStateSnapshot >(  config: StoreRouterConfig<T> = {} ): ModuleWithProviders<StoreRouterConnectingModule>;
````

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/router-store/src/router_store_module.ts#L153-L177)

#### Parameters (#forRoot-parameters)

| Name   | Type                   | Description |
| ------ | ---------------------- | ----------- |
| config | `StoreRouterConfig<T>` |             |
