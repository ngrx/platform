import { RouterStateSnapshot } from '@angular/router';
import { BaseRouterStoreState, RouterStateSerializer } from './shared';

export interface MinimalRouterStateSnapshot extends BaseRouterStoreState {
  url: RouterStateSnapshot['url'];
  params: RouterStateSnapshot['root']['params'];
  queryParams: RouterStateSnapshot['root']['queryParams'];
  data: RouterStateSnapshot['root']['data'];
}

export class MinimalRouterStateSerializer
  implements RouterStateSerializer<MinimalRouterStateSnapshot> {
  serialize(routerState: RouterStateSnapshot): MinimalRouterStateSnapshot {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams, data },
    } = routerState;
    const { params } = route;

    return { url, params, queryParams, data };
  }
}
