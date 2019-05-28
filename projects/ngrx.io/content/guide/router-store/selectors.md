## Router selectors

The `getSelectors` method supplied within `@ngrx/router-store` provides functions for selecting information from router state.

The `getSelectors` method takes a selector function as its only argument to select the piece of state.

Usage:

`reducers/index.ts`

```ts
import { getSelectors, RouterReducerState } from '@ngrx/router-store';

export interface State {
  router: fromRouter.RouterReducerState<any>;
}

export const selectRouter = createFeatureSelector<
  State,
  fromRouter.RouterReducerState<any>
>('router');

const {
  selectQueryParams,
  selectRouteParams,
  selectRouteData,
  selectUrl,
} = getSelectors(selectRouter);

// select the current url
export const selectCurrentUrl = selectUrl;

// select the current route query params
export const selectCurrentQueryParams = selectQueryParams;

// select the current route data
export const selectCurrentRouteData = selectRouteData;

// select the current route params
export const selectCurrentRouteParams = selectRouteParams;
```
