import { Data, Params } from '@angular/router';

export interface RouterStateSelectors<V> {
  selectCurrentRoute: (state: V) => any;
  selectQueryParams: (state: V) => Params;
  selectQueryParam: (param: string) => (state: V) => string | undefined;
  selectRouteParams: (state: V) => Params;
  selectRouteParam: (param: string) => (state: V) => string | undefined;
  selectRouteData: (state: V) => Data;
  selectUrl: (state: V) => string;
}
