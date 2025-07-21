import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RoutesRecognized,
} from '@angular/router';

import { BaseRouterStoreState } from './serializers/base';
import { SerializedRouterStateSnapshot } from './serializers/full_serializer';
import { createAction, props } from '@ngrx/store';

/**
 * An action dispatched when a router navigation request is fired.
 *
 * @public
 */
export const ROUTER_REQUEST = '@ngrx/router-store/request';

/**
 * Payload of ROUTER_REQUEST
 *
 * @public
 */
export type RouterRequestPayload<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  routerState: T;
  event: NavigationStart;
};

/**
 * An action dispatched when a router navigation request is fired.
 *
 * @public
 */
export type RouterRequestAction<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_REQUEST;
  payload: RouterRequestPayload<T>;
};

/**
 * Action creator for router request actions.
 *
 * @public
 */
export const routerRequestAction = createAction(
  ROUTER_REQUEST,
  props<{ payload: RouterRequestPayload<SerializedRouterStateSnapshot> }>()
);

/**
 * An action dispatched when the router navigates.
 *
 * @public
 */
export const ROUTER_NAVIGATION = '@ngrx/router-store/navigation';

/**
 * Payload of ROUTER_NAVIGATION.
 *
 * @public
 */
export type RouterNavigationPayload<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  routerState: T;
  event: RoutesRecognized;
};

/**
 * An action dispatched when the router navigates.
 *
 * @public
 */
export type RouterNavigationAction<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_NAVIGATION;
  payload: RouterNavigationPayload<T>;
};

/**
 * Action creator for router navigation actions.
 *
 * @public
 */
export const routerNavigationAction = createAction(
  ROUTER_NAVIGATION,
  props<{ payload: RouterNavigationPayload<SerializedRouterStateSnapshot> }>()
);

/**
 * An action dispatched when the router cancels navigation.
 *
 * @public
 */
export const ROUTER_CANCEL = '@ngrx/router-store/cancel';

/**
 * Payload of ROUTER_CANCEL.
 *
 * @public
 */
export type RouterCancelPayload<
  T,
  V extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  routerState: V;
  storeState: T;
  event: NavigationCancel;
};

/**
 * An action dispatched when the router cancels navigation.
 *
 * @public
 */
export type RouterCancelAction<
  T,
  V extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_CANCEL;
  payload: RouterCancelPayload<T, V>;
};

/**
 * Action creator for router cancel actions.
 *
 * @public
 */
export const routerCancelAction = createAction(
  ROUTER_CANCEL,
  props<{ payload: RouterCancelPayload<SerializedRouterStateSnapshot> }>()
);

/**
 * An action dispatched when the router errors.
 *
 * @public
 */
export const ROUTER_ERROR = '@ngrx/router-store/error';

/**
 * Payload of ROUTER_ERROR.
 *
 * @public
 */
export type RouterErrorPayload<
  T,
  V extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  routerState: V;
  storeState: T;
  event: NavigationError;
};

/**
 * An action dispatched when the router errors.
 *
 * @public
 */
export type RouterErrorAction<
  T,
  V extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_ERROR;
  payload: RouterErrorPayload<T, V>;
};

/**
 * Action creator for router error actions.
 *
 * @public
 */
export const routerErrorAction = createAction(
  ROUTER_ERROR,
  props<{ payload: RouterErrorPayload<SerializedRouterStateSnapshot> }>()
);

/**
 * An action dispatched after navigation has ended and new route is active.
 *
 * @public
 */
export const ROUTER_NAVIGATED = '@ngrx/router-store/navigated';

/**
 * Payload of ROUTER_NAVIGATED.
 *
 * @public
 */
export type RouterNavigatedPayload<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  routerState: T;
  event: NavigationEnd;
};

/**
 * An action dispatched after navigation has ended and new route is active.
 *
 * @public
 */
export type RouterNavigatedAction<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_NAVIGATED;
  payload: RouterNavigatedPayload<T>;
};

/**
 * Action creator for router navigated actions.
 *
 * @public
 */
export const routerNavigatedAction = createAction(
  ROUTER_NAVIGATED,
  props<{ payload: RouterNavigatedPayload<SerializedRouterStateSnapshot> }>()
);

/**
 * A union type of router actions.
 *
 * @public
 */
export type RouterAction<
  T,
  V extends BaseRouterStoreState = SerializedRouterStateSnapshot
> =
  | RouterRequestAction<V>
  | RouterNavigationAction<V>
  | RouterCancelAction<T, V>
  | RouterErrorAction<T, V>
  | RouterNavigatedAction<V>;
