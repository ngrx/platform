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
  const selectQueryParams = (state: any) =>
    state && state.state.root.queryParams;
  const selectRouteParams = (state: any) =>
    state && state.state.root.routeParams;
  const selectRouteData = (state: any) => state && state.state.root.data;
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
