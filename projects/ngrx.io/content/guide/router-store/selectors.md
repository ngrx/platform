# Router selectors

The `getSelectors` method supplied within `@ngrx/router-store` provides functions for selecting common information from the router state.

The `getSelectors` method takes a selector function as its only argument to select the piece of state where the router state is being stored.
The example below shows how to provide a selector for the top level `router` key in your state object.

**Note:** The `getSelectors` method works with the `routerReducer` provided by `@ngrx/router-store`. If you use a [custom serializer](guide/router-store/configuration#custom-router-state-serializer), you'll need to provide your own selectors.

Usage:

## Creating a Selector for A Single Entity With Id As Route Param

[Full App Used In This Example](https://stackblitz.com/edit/ngrx-router-store-selectors?file=src/app/car.state.ts)

`router.selectors.ts`

```ts
import { getSelectors, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';

export const selectRouter = createFeatureSelector<RouterReducerState>('router');

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl, // select the current url
} = getSelectors(selectRouter);
```

`car.reducer.ts`

```ts
import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { appInit } from './car.actions';

export interface Car {
  id: string;
  year: string;
  make: string;
  model: string;
}

export type CarState = EntityState<Car>;

export const carAdapter = createEntityAdapter<Car>({
  selectId: car => car.id,
});

const initialState = carAdapter.getInitialState();

export const reducer = createReducer<CarState>(
  initialState,
  on(appInit, (state, { cars }) => carAdapter.addMany(cars, state))
);
```

`car.selectors.ts`

```ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectRouteParams } from '../router.selectors';
import { carAdapter, CarState } from './car.reducer';

export const carsFeatureSelector = createFeatureSelector<CarState>('cars');

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
  (cars, { carId }) => cars[carId]
);
```

`car.component.ts`

```ts
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
