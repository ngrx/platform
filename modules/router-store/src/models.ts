import { RouterReducerState } from '@ngrx/router-store';

export interface RouterSelectors<T, V> {
  selectQueryParams: (state: V) => string[];
  selectRouteParams: (state: V) => string[] | number[];
  selectRouteData: (state: V) => T[];
  selectUrl: (state: V) => string;
}

export interface RouterAdapter<T> {
  getSelectors(): RouterSelectors<T, RouterReducerState>;
  getSelectors<V>(
    selectState: (state: V) => RouterReducerState
  ): RouterSelectors<T, V>;
}
