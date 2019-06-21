import { Data, Params } from '@angular/router';

export interface RouterStateSelectors<V> {
  selectCurrentRoute: (state: V) => any;
  selectQueryParams: (state: V) => Params;
  selectRouteParams: (state: V) => Params;
  selectRouteData: (state: V) => Data;
  selectUrl: (state: V) => string;
}
