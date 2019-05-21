import { RouterReducerState } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import { RouterStateSelectors } from './models';

export function getSelectors(): RouterStateSelectors<
  any,
  RouterReducerState<any>
>;
export function getSelectors<V>(
  selectState: (state: V) => RouterReducerState<any>
): RouterStateSelectors<any, V>;
export function getSelectors<T>(
  selectState?: (state: any) => RouterReducerState
): RouterStateSelectors<T, any> {
  const selectQueryParams = (state: any) => {
    if (state && state.state.root) {
      return routeTraverse(state, 'query');
    } else {
      return state;
    }
  };
  const selectRouteParams = (state: any) => {
    if (state && state.state.root) {
      return routeTraverse(state, 'route');
    } else {
      return state;
    }
  };
  const selectRouteData = (state: any) => {
    if (state && state.state.root) {
      return routeTraverse(state, 'data');
    } else {
      return state;
    }
  };
  const selectUrl = (state: any) => state && state.state.url;

  if (!selectState) {
    return {
      selectQueryParams,
      selectRouteParams,
      selectRouteData,
      selectUrl,
    };
  }

  return {
    selectQueryParams: createSelector(selectState, selectQueryParams),
    selectRouteParams: createSelector(selectState, selectRouteParams),
    selectRouteData: createSelector(selectState, selectRouteData),
    selectUrl: createSelector(selectState, selectUrl),
  };
}

export function routeTraverse(state: any, v: any) {
  let routerState = state.state;
  let route = routerState.root;
  while (route.firstChild) {
    route = route.firstChild;
  }
  switch (v) {
    case 'data':
      const { data } = route;
      return { data };
    case 'query':
      const { queryParams } = route;
      return { queryParams };
    case 'route':
      const { params } = route;
      return { params };
  }
}
