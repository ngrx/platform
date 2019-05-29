import { RouterReducerState } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import { RouterStateSelectors } from './models';

export function getSelectors<V>(
  selectState: (state: V) => RouterReducerState<any>
): RouterStateSelectors<V>;
export function getSelectors<V>(
  selectState: (state: V) => RouterReducerState<any>
): RouterStateSelectors<V> {
  const selectRouterState = createSelector(
    selectState,
    router => router && router.state
  );
  const selectCurrentRoute = createSelector(selectRouterState, routerState => {
    if (!routerState) {
      return undefined;
    }
    let route = routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  });
  const selectQueryParams = createSelector(
    selectCurrentRoute,
    route => route && route.queryParams
  );
  const selectRouteParams = createSelector(
    selectCurrentRoute,
    route => route && route.params
  );
  const selectRouteData = createSelector(
    selectCurrentRoute,
    route => route && route.data
  );
  const selectUrl = createSelector(
    selectRouterState,
    routerState => routerState && routerState.url
  );

  return {
    selectCurrentRoute,
    selectQueryParams,
    selectRouteParams,
    selectRouteData,
    selectUrl,
  };
}
