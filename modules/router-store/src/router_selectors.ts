import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { RouterStateSelectors } from './models';
import { RouterReducerState } from './reducer';
import { DEFAULT_ROUTER_FEATURENAME } from './router_store_config';

export function createRouterSelector<
  State extends Record<string, any>
>(): MemoizedSelector<State, RouterReducerState> {
  return createFeatureSelector(DEFAULT_ROUTER_FEATURENAME);
}

export function getSelectors<V extends Record<string, any>>(
  selectState: (state: V) => RouterReducerState<any> = createRouterSelector<V>()
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
  const selectRouteDataParam = (param: string) =>
    createSelector(selectRouteData, (data) => data && data[param]);
  const selectUrl = createSelector(
    selectRouterState,
    (routerState) => routerState && routerState.url
  );
  const selectTitle = createSelector(selectCurrentRoute, (route) => {
    if (!route?.routeConfig) {
      return undefined;
    }
    return typeof route.routeConfig.title === 'string'
      ? route.routeConfig.title // static title
      : route.title; // resolved title
  });

  return {
    selectCurrentRoute,
    selectFragment,
    selectQueryParams,
    selectQueryParam,
    selectRouteParams,
    selectRouteParam,
    selectRouteData,
    selectRouteDataParam,
    selectUrl,
    selectTitle,
  };
}
