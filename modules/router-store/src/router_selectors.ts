import { RouterReducerState } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import { RouterSelectors } from './models';

export function createSelectorsFactory<T>() {
  function getSelectors(): RouterSelectors<T, RouterReducerState>;
  function getSelectors<V>(
    selectState: (state: V) => RouterReducerState
  ): RouterSelectors<T, V>;
  function getSelectors(
    selectState?: (state: any) => RouterReducerState
  ): RouterSelectors<T, any> {
    const selectQueryParams = (state: any) => state.queryParams;
    const selectRouteParams = (state: any) => state.routeParams;
    const selectRouteData = (state: any) => state.routeData;
    const selectUrl = (state: any) => state.url;

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

  return { getSelectors };
}
