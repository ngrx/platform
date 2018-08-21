import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/**
 * Simple router state.
 * All custom router states / state serializers should have at least this property.
 */
export interface RouterState {
  url: string;
}

export abstract class RouterStateSerializer<T extends RouterState = RouterState> {
  abstract serialize(routerState: RouterStateSnapshot): T;
}

export interface SerializedRouterStateSnapshot extends RouterState {
  root: ActivatedRouteSnapshot;
  url: string;
}

export class DefaultRouterStateSerializer
  implements RouterStateSerializer<SerializedRouterStateSnapshot> {
  serialize(routerState: RouterStateSnapshot): SerializedRouterStateSnapshot {
    return {
      root: this.serializeRoute(routerState.root),
      url: routerState.url,
    };
  }

  private serializeRoute(
    route: ActivatedRouteSnapshot
  ): ActivatedRouteSnapshot {
    const children = route.children.map(c => this.serializeRoute(c));
    return {
      params: route.params,
      paramMap: route.paramMap,
      data: route.data,
      url: route.url,
      outlet: route.outlet,
      routeConfig: {
        component: route.routeConfig ? route.routeConfig.component : undefined,
      },
      queryParams: route.queryParams,
      queryParamMap: route.queryParamMap,
      fragment: route.fragment,
      component: (route.routeConfig
        ? route.routeConfig.component
        : undefined) as any,
      root: undefined as any,
      parent: undefined as any,
      firstChild: children[0],
      pathFromRoot: undefined as any,
      children,
    };
  }
}
