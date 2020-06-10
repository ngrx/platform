import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { BaseRouterStoreState, RouterStateSerializer } from './base';

export interface MinimalActivatedRouteSnapshot {
  routeConfig: ActivatedRouteSnapshot['routeConfig'];
  url: ActivatedRouteSnapshot['url'];
  params: ActivatedRouteSnapshot['params'];
  queryParams: ActivatedRouteSnapshot['queryParams'];
  fragment: ActivatedRouteSnapshot['fragment'];
  data: ActivatedRouteSnapshot['data'];
  outlet: ActivatedRouteSnapshot['outlet'];
  firstChild?: MinimalActivatedRouteSnapshot;
  children: MinimalActivatedRouteSnapshot[];
}

export interface MinimalRouterStateSnapshot extends BaseRouterStoreState {
  root: MinimalActivatedRouteSnapshot;
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

  private serializeRoute(
    route: ActivatedRouteSnapshot
  ): MinimalActivatedRouteSnapshot {
    const children = route.children.map((c) => this.serializeRoute(c));
    return {
      params: route.params,
      data: route.data,
      url: route.url,
      outlet: route.outlet,
      routeConfig: route.routeConfig
        ? {
            path: route.routeConfig.path,
            pathMatch: route.routeConfig.pathMatch,
            redirectTo: route.routeConfig.redirectTo,
            outlet: route.routeConfig.outlet,
          }
        : null,
      queryParams: route.queryParams,
      fragment: route.fragment,
      firstChild: children[0],
      children,
    };
  }
}
