import { RouterStateSnapshot } from '@angular/router';

/**
 * Simple router state.
 * All custom router states / state serializers should have at least
 * the properties of this interface.
 *
 * @public
 */
export interface BaseRouterStoreState {
  url: string;
}

/**
 * Base class for router state serializers.
 * It is used to define the shape of the router state in the store.
 * Custom serializers should extend this class and implement the `serialize` method.
 *
 * @public
 */
export abstract class RouterStateSerializer<
  T extends BaseRouterStoreState = BaseRouterStoreState
> {
  abstract serialize(routerState: RouterStateSnapshot): T;
}
