import { Data, Params } from '@angular/router';

export interface RouterStateSelectors<T, V> {
  selectQueryParams: (state: V) => Params;
  selectRouteParams: (state: V) => Params;
  selectRouteData: (state: V) => Data;
  selectUrl: (state: V) => string;
}
