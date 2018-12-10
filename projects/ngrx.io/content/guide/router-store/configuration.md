# Configuration Options

```ts
interface StoreRouterConfig {
  stateKey?: string | Selector<any, RouterReducerState<T>>;
  serializer?: new (...args: any[]) => RouterStateSerializer;
  navigationActionTiming?: NavigationActionTiming;
}
```

- `stateKey`: The name of reducer key, defaults to `router`. It's also possible to provide a selector function.
- `serializer`: How a router snapshot is serialized. Defaults to `DefaultRouterStateSerializer`. See [Custom Router State Serializer](#custom-router-state-serializer) for more information.
- `navigationActionTiming`: When the `ROUTER_NAVIGATION` is dispatched. Defaults to `NavigationActionTiming.PreActivation`. See [Navigation Action Timing](#navigation-action-timing) for more information.

## Custom Router State Serializer

During each navigation cycle, a `RouterNavigationAction` is dispatched with a snapshot of the state in its payload, the `RouterStateSnapshot`. The `RouterStateSnapshot` is a large complex structure, containing many pieces of information about the current state and what's rendered by the router. This can cause performance
issues when used with the Store Devtools. In most cases, you may only need a piece of information from the `RouterStateSnapshot`. In order to pare down the `RouterStateSnapshot` provided during navigation, you provide a custom serializer for the snapshot to only return what you need to be added to the payload and store.

Additionally, the router state snapshot is a mutable object, which can cause issues when developing with [store freeze](https://github.com/brandonroberts/ngrx-store-freeze) to prevent direct state mutations. This can be avoided by using a custom serializer.

Your custom serializer should implement the abstract class `RouterStateSerializer` and return a snapshot which should have an interface extending `BaseRouterStoreState`.

You then provide the serializer through the config.

**In a custom serializer ts file**

```ts
import { Params, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}
```

**In your root reducer**

```ts
export const reducers: ActionReducerMap<State> = {
  router: routerReducer
};
```

**In your AppModule**

```ts
@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    RouterModule.forRoot([
      // routes
    ]),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer
    })
  ]
})
export class AppModule {}
```

## Navigation action timing

`ROUTER_NAVIGATION` is by default dispatched before any guards or resolvers run. This may not always be ideal, for example if you rely on the action to be dispatched after guards and resolvers successfully ran and the new route will be activated. You can change the dispatch timing by providing the corresponding config:

```ts
StoreRouterConnectingModule.forRoot({
  navigationActionTiming: NavigationActionTiming.PostActivation,
});
```
