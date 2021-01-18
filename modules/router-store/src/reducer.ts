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
  RouterState extends BaseRouterStoreState = SerializedRouterStateSnapshot,
  Result = RouterReducerState<RouterState>
>(state: Result | undefined, action: Action): Result {
  // Allow compilation with strictFunctionTypes - ref: #1344
  const routerAction = action as RouterAction<any, RouterState>;
  switch (routerAction.type) {
    case ROUTER_NAVIGATION:
    case ROUTER_ERROR:
    case ROUTER_CANCEL:
      return ({
        state: routerAction.payload.routerState,
        navigationId: routerAction.payload.event.id,
      } as unknown) as Result;
    default:
      return state as Result;
  }
}
