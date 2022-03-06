# Router selectors

The `getSelectors` method supplied within `@ngrx/router-store` provides functions for selecting common information from the router state.

The default behavior of `getSelectors` selects the router state for the `router` state key.
If the default router state config is overwritten with a different router state key, the `getSelectors` method takes a selector function to select the piece of state where the router state is being stored.
The example below shows how to provide a selector for the top level `router` key in your state object.

**Note:** The `getSelectors` method works with the `routerReducer` provided by `@ngrx/router-store`. If you use a [custom serializer](guide/router-store/configuration#custom-router-state-serializer), you'll need to provide your own selectors.

Usage:

<div class="alert is-helpful">

You can see the full example at StackBlitz: <live-example name="router-store-selectors"></live-example>

</div>

## Creating a Selector for A Single Entity With Id As Route Param

<code-example header="router.selectors.ts" path="router-store-selectors/src/app/router.selectors.ts" region="routerSelectors">
</code-example>

<code-example header="car.reducer.ts" path="router-store-selectors/src/app/car/car.reducer.ts" region="carReducer">
</code-example>

<code-example header="car.selectors.ts" path="router-store-selectors/src/app/car/car.selectors.ts" region="carSelectors">
</code-example>

<code-example header="car.component.ts" path="router-store-selectors/src/app/car/car.component.ts" region="carComponent">
</code-example>

## Extracting all params in the current route

The `selectRouteParam{s}` selector extracts params from the **leaf child** route segment only.

It means that when using nested routes with the Angular router (use of the `children` property), only params from the leaf of the matching URL Tree will be extracted.

If the routes are defined as:

```typescript
[
  {
    path: 'my/:urlPath',
    component: /* ... */,
    children: [
      {
        path: 'is/:matched',
        component: /* ... */,
      },
    ],
  },
]
```

Using `selectRouteParam{s}` will get the `matched` param but not the `urlPath` param, because it is not located in a leaf of the URL Tree.

If all params in the URL Tree need to be extracted (both `urlPath` and `matched`), the following custom selector can be used. It accumulates params of all the segments in the matched route:

<code-example>
import { Params } from '@angular/router';
import { createSelector } from '@ngrx/store';

export const selectRouteNestedParams = createSelector(selectRouter, (router) =&gt; {
  let currentRoute = router?.state?.root;
  let params: Params = {};
  while (currentRoute?.firstChild) {
    currentRoute = currentRoute.firstChild;
    params = {
      ...params,
      ...currentRoute.params,
    };
  }
  return params;
});

export const selectRouteNestedParam = (param: string) =&gt;
  createSelector(selectRouteNestedParams, (params) =&gt; params &amp;&amp; params[param]);
</code-example>

<div class="alert is-important">

Beware of using this accumulation technique when two params with the same name exist in the route (e.g. `my/:route/:id/with/another/:id`). Only the rightmost value is accessible because leftmost values are overwritten by the rightmost one in the traversal.

</div>
