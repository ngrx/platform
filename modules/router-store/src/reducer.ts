import {
  ROUTER_CANCEL,
  ROUTER_ERROR,
  ROUTER_NAVIGATION,
  RouterAction,
} from './actions';
import {
  BaseRouterStoreState,
  SerializedRouterStateSnapshot,
} from './serializer';

export type RouterReducerState<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  state: T;
  navigationId: number;
};

export function routerReducer<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
>(
  state: RouterReducerState<T> | undefined,
  action: RouterAction<any, T>
): RouterReducerState<T> {
  switch (action.type) {
    case ROUTER_NAVIGATION:
    case ROUTER_ERROR:
    case ROUTER_CANCEL:
      return {
        state: action.payload.routerState,
        navigationId: action.payload.event.id,
      };
    default:
      return state as RouterReducerState<T>;
  }
}
