export interface RouterStateSelectors<T, V> {
  selectQueryParams: (state: V) => string[];
  selectRouteParams: (state: V) => string[] | number[];
  selectRouteData: (state: V) => T[];
  selectUrl: (state: V) => string;
}
