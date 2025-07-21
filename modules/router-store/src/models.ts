import { Data, Params } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';

/**
 * A collection of router state selectors for accessing router information.
 *
 * @public
 */
export type RouterStateSelectors<V> = {
  selectCurrentRoute: MemoizedSelector<V, any>;
  selectFragment: MemoizedSelector<V, string | undefined>;
  selectQueryParams: MemoizedSelector<V, Params>;
  selectQueryParam: (
    param: string
  ) => MemoizedSelector<V, string | string[] | undefined>;
  selectRouteParams: MemoizedSelector<V, Params>;
  selectRouteParam: (param: string) => MemoizedSelector<V, string | undefined>;
  selectRouteData: MemoizedSelector<V, Data>;
  selectRouteDataParam: (
    param: string
  ) => MemoizedSelector<V, string | undefined>;
  selectUrl: MemoizedSelector<V, string>;
  selectTitle: MemoizedSelector<V, string | undefined>;
};
