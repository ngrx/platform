import { Params, Data } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';

export interface RouterStateSelectors<V> {
  selectCurrentRoute: MemoizedSelector<V, any>;
  selectFragment: MemoizedSelector<V, string | undefined>;
  selectQueryParams: MemoizedSelector<V, Params>;
  selectQueryParam: (param: string) => MemoizedSelector<V, string | undefined>;
  selectRouteParams: MemoizedSelector<V, Params>;
  selectRouteParam: (param: string) => MemoizedSelector<V, string | undefined>;
  selectRouteData: MemoizedSelector<V, Data>;
  selectUrl: MemoizedSelector<V, string>;
}
