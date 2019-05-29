# Router selectors

The `getSelectors` method supplied within `@ngrx/router-store` provides functions for selecting common information from the router state.

The `getSelectors` method takes a selector function as its only argument to select the piece of state where the router state is being stored.
The example below shows how to provide a selector for the top level `router` key in your state object.

**Note:** The `getSelectors` method works with the `routerReducer` provided by `@ngrx/router-store`. If you use a [custom serializer](guide/router-store/configuration#custom-router-state-serializer), you'll need to provide your own selectors.

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
  selectQueryParams,    // select the current route query params
  selectRouteParams,    // select the current route params
  selectRouteData,      // select the current route data
  selectUrl,            // select the current url
} = getSelectors(selectRouter);

```
