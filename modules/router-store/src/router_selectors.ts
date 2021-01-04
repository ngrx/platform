import { createSelector } from '@ngrx/store';
import { RouterStateSelectors } from './models';
import { RouterReducerState } from './reducer';

export function getSelectors<V>(
  selectState: (state: V) => RouterReducerState<any>
): RouterStateSelectors<V> {
  const selectRouterState = createSelector(
    selectState,
    (router) => router && router.state
  );
  const selectRootRoute = createSelector(
    selectRouterState,
    (routerState) => routerState && routerState.root
  );
  const selectCurrentRoute = createSelector(selectRootRoute, (rootRoute) => {
    if (!rootRoute) {
      return undefined;
    }
    let route = rootRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  });
  const selectFragment = createSelector(
    selectRootRoute,
    (route) => route && route.fragment
  );
  const selectQueryParams = createSelector(
    selectRootRoute,
    (route) => route && route.queryParams
  );
  const selectQueryParam = (param: string) =>
    createSelector(selectQueryParams, (params) => params && params[param]);
  const selectRouteParams = createSelector(
    selectCurrentRoute,
    (route) => route && route.params
  );
  const selectRouteParam = (param: string) =>
    createSelector(selectRouteParams, (params) => params && params[param]);
  const selectRouteData = createSelector(
    selectCurrentRoute,
    (route) => route && route.data
  );
  const selectUrl = createSelector(
    selectRouterState,
    (routerState) => routerState && routerState.url
  );

  return {
    selectCurrentRoute,
    selectFragment,
    selectQueryParams,
    selectQueryParam,
    selectRouteParams,
    selectRouteParam,
    selectRouteData,
    selectUrl,
  };
}
