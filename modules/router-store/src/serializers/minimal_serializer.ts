import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { BaseRouterStoreState, RouterStateSerializer } from './shared';

export interface MinimalRouteSnapshot {
  params: RouterStateSnapshot['root']['params'];
  url: RouterStateSnapshot['root']['params'];
  queryParams: RouterStateSnapshot['root']['params'];
  data: RouterStateSnapshot['root']['params'];
}

export interface MinimalRouterStateSnapshot extends BaseRouterStoreState {
  root: MinimalRouteSnapshot;
  url: string;
}

export class MinimalRouterStateSerializer
  implements RouterStateSerializer<MinimalRouterStateSnapshot> {
  serialize(routerState: RouterStateSnapshot): MinimalRouterStateSnapshot {
    return {
      root: this.serializeRoute(routerState.root),
      url: routerState.url,
    };
  }

  private serializeRoute(route: ActivatedRouteSnapshot): MinimalRouteSnapshot {
    return {
      params: route.params,
      url: route.url,
      data: route.data,
      queryParams: route.queryParams,
    };
  }
}
