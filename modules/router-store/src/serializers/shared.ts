import { RouterStateSnapshot } from '@angular/router';

/**
 * Simple router state.
 * All custom router states / state serializers should have at least
 * the properties of this interface.
 */
export interface BaseRouterStoreState {
  url: string;
}

export abstract class RouterStateSerializer<
  T extends BaseRouterStoreState = BaseRouterStoreState
> {
  abstract serialize(routerState: RouterStateSnapshot): T;
}
