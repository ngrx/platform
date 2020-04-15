import { Data, Params } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';

export interface RouterStateSelectors<V> {
  selectCurrentRoute: MemoizedSelector<V, any>;
  selectQueryParams: MemoizedSelector<V, Params>;
  selectQueryParam: (param: string) => MemoizedSelector<V, string | undefined>;
  selectRouteParams: (state: V) => MemoizedSelector<V, Params>;
  selectRouteParam: (
    param: string
  ) => (state: V) => MemoizedSelector<V, string | undefined>;
  selectRouteData: (state: V) => MemoizedSelector<V, Data>;
  selectUrl: (state: V) => MemoizedSelector<V, string>;
}
