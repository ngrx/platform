# Configuration Options

<code-example header="RouterStore Config">
interface StoreRouterConfig {
  stateKey?: string | Selector&lt;any, RouterReducerState&lt;T&gt;&gt;;
  serializer?: new (...args: any[]) => RouterStateSerializer;
  navigationActionTiming?: NavigationActionTiming;
  routerState?: RouterState;
}
</code-example>

- `stateKey`: The name of reducer key, defaults to `router`. It's also possible to provide a selector function.
- `serializer`: How a router snapshot is serialized. Defaults to `MinimalRouterStateSerializer`. See [Custom Router State Serializer](#custom-router-state-serializer) for more information.
- `navigationActionTiming`: When the `ROUTER_NAVIGATION` is dispatched. Defaults to `NavigationActionTiming.PreActivation`. See [Navigation Action Timing](#navigation-action-timing) for more information.
- `routerState`: Set this property to decide which serializer should be used, if none is provided, and the metadata on the dispatched action.

## Custom Router State Serializer

During each navigation cycle, a `RouterNavigationAction` is dispatched with a snapshot of the state in its payload, the `RouterStateSnapshot`. The `RouterStateSnapshot` is a large complex structure, containing many pieces of information about the current state and what's rendered by the router. This can cause performance
issues when used with the Store Devtools. In most cases, you may only need a piece of information from the `RouterStateSnapshot`. In order to pare down the `RouterStateSnapshot` provided during navigation, you provide a custom serializer for the snapshot to only return what you need to be added to the payload and store.

Your custom serializer should implement the abstract class `RouterStateSerializer` and return a snapshot which should have an interface extending `BaseRouterStoreState`.

You then provide the serializer through the config.

**In a custom serializer ts file**

<code-example header="custom-route-serializer.ts">
import { Params, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer&lt;RouterStateUrl&gt; {
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
</code-example>

**In your root reducer**

<code-example header="index.ts">
export interface State {
  router: RouterReducerState&lt;any&gt;;
}
  
export const reducers: ActionReducerMap&lt;State&gt; = {
  router: routerReducer
};
</code-example>

**In your AppModule**

<code-example header="app.module.ts">
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
</code-example>

## Navigation action timing

`ROUTER_NAVIGATION` is by default dispatched before any guards or resolvers run. This may not always be ideal, for example if you rely on the action to be dispatched after guards and resolvers successfully ran and the new route will be activated. You can change the dispatch timing by providing the corresponding config:

<code-example header="app.module.ts">
StoreRouterConnectingModule.forRoot({
  navigationActionTiming: NavigationActionTiming.PostActivation,
});
</code-example>

## Router State Snapshot

This property decides which router serializer should be used. If there is a custom serializer provided, it will use the provided serializer. `routerState` also sets the metadata on dispatched `@ngrx/router-store` action.

### RouterState.Minimal

`RouterState.Minimal` uses the `MinimalRouterStateSerializer` serializer to serialize the Angular Router's `RouterState` and `RouterEvent`.

The difference between `FullRouterStateSerializer` and the `MinimalRouterStateSerializer` is that this serializer is fully serializable. To make the state and the actions serializable, the properties `paramMap`, `queryParamMap` and `component` are ignored.

<code-example header="app.module.ts">
StoreRouterConnectingModule.forRoot({
  routerState: RouterState.Minimal,
});
</code-example>

### RouterState.Full

When this property is set to `RouterState.Full`, `@ngrx/router-store` uses the `FullRouterStateSerializer` serializer to serialize the Angular router event.

The metadata on the action contains the Angular router event, e.g. `NavigationStart` and `RoutesRecognized`.

<code-example header="app.module.ts">
StoreRouterConnectingModule.forRoot({
  routerState: RouterState.Full,
});
</code-example>

<div class="alert is-important">

The `FullRouterStateSerializer` cannot be used when [serializability runtime checks](guide/store/configuration/runtime-checks) are enabled.
With serializability runtime checks enabled, the `MinimalRouterStateSerializer` serializer **must** be used.

</div>
