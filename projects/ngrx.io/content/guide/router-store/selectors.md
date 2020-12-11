# Router selectors

The `getSelectors` method supplied within `@ngrx/router-store` provides functions for selecting common information from the router state.

The `getSelectors` method takes a selector function as its only argument to select the piece of state where the router state is being stored.
The example below shows how to provide a selector for the top level `router` key in your state object.

**Note:** The `getSelectors` method works with the `routerReducer` provided by `@ngrx/router-store`. If you use a [custom serializer](guide/router-store/configuration#custom-router-state-serializer), you'll need to provide your own selectors.

Usage:

`reducers/index.ts`

```ts
import * as fromRouter from '@ngrx/router-store';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export interface State {
  router: fromRouter.RouterReducerState<any>;
}

export const selectRouter = createFeatureSelector<
  State,
  fromRouter.RouterReducerState<any>
>('router');

export const {
  selectCurrentRoute,         // select the current route
  selectFragment,             // select the current route fragment
  selectQueryParams,          // select the current route query params
  selectQueryParam,           // factory function to select a query param
  selectRouteParams,          // select the current route params
  selectRouteParam,           // factory function to select a route param
  selectParamFromRouterState, // factory function to select the first occurrence of a route param
  selectRouteData,            // select the current route data
  selectUrl,                  // select the current url
} = fromRouter.getSelectors(selectRouter);

export const selectSelectedCarId = selectQueryParam('carId');
export const selectCar = createSelector(
   selectCarEntities,
   selectSelectedCarId,
   (cars, carId) => cars[carId]
);

export const selectCarsByColor = createSelector(
   selectCarEntities,
   selectQueryParams,
   (cars, params) => cars.filter(c => c.color === params['color'])
);
```

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

```typescript
import { Params } from '@angular/router';
import { createSelector } from '@ngrx/store';

export const selectRouteNestedParams = createSelector(selectRouter, (router) => {
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

export const selectRouteNestedParam = (param: string) =>
  createSelector(selectRouteNestedParams, (params) => params && params[param]);
```

<div class="alert is-important">

Beware of using this accumulation technique when two params with the same name exist in the route (e.g. `my/:route/:id/with/another/:id`). Only the rightmost value is accessible because leftmost values are overwritten by the rightmost one in the traversal.

</div>
