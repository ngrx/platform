import { createSelector } from '@ngrx/store';
import { RouterStateSelectors } from './models';
import { RouterReducerState } from './reducer';

export function getSelectors<V>(
  selectState: (state: V) => RouterReducerState<any>
): RouterStateSelectors<V>;
export function getSelectors<V>(
  selectState: (state: V) => RouterReducerState<any>
): RouterStateSelectors<V> {
  const selectRouterState = createSelector(
    selectState,
    (router) => router && router.state
  );
  const selectCurrentRoute = createSelector(
    selectRouterState,
    (routerState) => {
      if (!routerState) {
        return undefined;
      }
      let route = routerState.root;
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }
  );
  const selectFragment = createSelector(
    selectCurrentRoute,
    (route) => route && route.fragment
  );
  const selectQueryParams = createSelector(
    selectCurrentRoute,
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
