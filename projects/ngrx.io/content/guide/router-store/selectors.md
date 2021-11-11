# Router selectors

The `getSelectors` method supplied within `@ngrx/router-store` provides functions for selecting common information from the router state.

The default behavior of `getSelectors` selects the router state for the `router` state key.
If the default router state config is overwritten with a different router state key, the `getSelectors` method takes a selector function to select the piece of state where the router state is being stored.
The example below shows how to provide a selector for the top level `router` key in your state object.

**Note:** The `getSelectors` method works with the `routerReducer` provided by `@ngrx/router-store`. If you use a [custom serializer](guide/router-store/configuration#custom-router-state-serializer), you'll need to provide your own selectors.

Usage:

## Creating a Selector for A Single Entity With Id As Route Param

[Full App Used In This Example](https://stackblitz.com/edit/ngrx-router-store-selectors?file=src/app/car.state.ts)

<code-example header="router.selectors.ts">
import { getSelectors } from '@ngrx/router-store';

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl, // select the current url
} = getSelectors();
</code-example>

<code-example header="car.reducer.ts" >
import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { appInit } from './car.actions';

export interface Car {
  id: string;
  year: string;
  make: string;
  model: string;
}

export type CarState = EntityState&lt;Car&gt;;

export const carAdapter = createEntityAdapter&lt;Car&gt;({
  selectId: car =&gt; car.id,
});

const initialState = carAdapter.getInitialState();

export const reducer = createReducer&lt;CarState&gt;(
  initialState,
  on(appInit, (state, { cars }) =&gt; carAdapter.addMany(cars, state))
);
</code-example>

<code-example header="car.selectors.ts" >
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectRouteParams } from '../router.selectors';
import { carAdapter, CarState } from './car.reducer';

export const carsFeatureSelector = createFeatureSelector&lt;CarState&gt;('cars');

const { selectEntities, selectAll } = carAdapter.getSelectors();

export const selectCarEntities = createSelector(
  carsFeatureSelector,
  selectEntities
);

export const selectCars = createSelector(
  carsFeatureSelector,
  selectAll
);

// you can combine the `selectRouteParams` with `selectCarEntities`
// to get a selector for the active car for this component based
// on the route
export const selectCar = createSelector(
  selectCarEntities,
  selectRouteParams,
  (cars, { carId }) =&gt; cars[carId]
);
</code-example>

<code-example header="car.component.ts" >
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectCar } from './car.selectors';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
})
export class CarComponent {
  car$ = this.store.pipe(select(selectCar));

  constructor(private store: Store) {}
}
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
