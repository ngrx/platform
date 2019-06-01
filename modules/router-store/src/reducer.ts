import { Action } from '@ngrx/store';
import {
  ROUTER_CANCEL,
  ROUTER_ERROR,
  ROUTER_NAVIGATION,
  RouterAction,
} from './actions';
import { BaseRouterStoreState } from './serializers/base';
import { SerializedRouterStateSnapshot } from './serializers/default_serializer';

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
  action: Action
): RouterReducerState<T> {
  // Allow compilation with strictFunctionTypes - ref: #1344
  const routerAction = action as RouterAction<any, T>;
  switch (routerAction.type) {
    case ROUTER_NAVIGATION:
    case ROUTER_ERROR:
    case ROUTER_CANCEL:
      return {
        state: routerAction.payload.routerState,
        navigationId: routerAction.payload.event.id,
      };
    default:
      return state as RouterReducerState<T>;
  }
}
