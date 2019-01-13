import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RoutesRecognized,
} from '@angular/router';

import {
  BaseRouterStoreState,
  SerializedRouterStateSnapshot,
} from './serializer';

/**
 * An action dispatched when a router navigation request is fired.
 */
export const ROUTER_REQUEST = '@ngrx/router-store/request';

/**
 * Payload of ROUTER_REQUEST
 */
export type RouterRequestPayload<T extends BaseRouterStoreState> = {
  routerState: T;
  event: NavigationStart;
};

/**
 * An action dispatched when a router navigation request is fired.
 */
export type RouterRequestAction<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_REQUEST;
  payload: RouterRequestPayload<T>;
};

/**
 * An action dispatched when the router navigates.
 */
export const ROUTER_NAVIGATION = '@ngrx/router-store/navigation';

/**
 * Payload of ROUTER_NAVIGATION.
 */
export type RouterNavigationPayload<T extends BaseRouterStoreState> = {
  routerState: T;
  event: RoutesRecognized;
};

/**
 * An action dispatched when the router navigates.
 */
export type RouterNavigationAction<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_NAVIGATION;
  payload: RouterNavigationPayload<T>;
};

/**
 * An action dispatched when the router cancels navigation.
 */
export const ROUTER_CANCEL = '@ngrx/router-store/cancel';

/**
 * Payload of ROUTER_CANCEL.
 */
export type RouterCancelPayload<T, V extends BaseRouterStoreState> = {
  routerState: V;
  storeState: T;
  event: NavigationCancel;
};

/**
 * An action dispatched when the router cancels navigation.
 */
export type RouterCancelAction<
  T,
  V extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_CANCEL;
  payload: RouterCancelPayload<T, V>;
};

/**
 * An action dispatched when the router errors.
 */
export const ROUTER_ERROR = '@ngrx/router-store/error';

/**
 * Payload of ROUTER_ERROR.
 */
export type RouterErrorPayload<T, V extends BaseRouterStoreState> = {
  routerState: V;
  storeState: T;
  event: NavigationError;
};

/**
 * An action dispatched when the router errors.
 */
export type RouterErrorAction<
  T,
  V extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_ERROR;
  payload: RouterErrorPayload<T, V>;
};

/**
 * An action dispatched after navigation has ended and new route is active.
 */
export const ROUTER_NAVIGATED = '@ngrx/router-store/navigated';

/**
 * Payload of ROUTER_NAVIGATED.
 */
export type RouterNavigatedPayload<T extends BaseRouterStoreState> = {
  routerState: T;
  event: NavigationEnd;
};

/**
 * An action dispatched after navigation has ended and new route is active.
 */
export type RouterNavigatedAction<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = {
  type: typeof ROUTER_NAVIGATED;
  payload: RouterNavigatedPayload<T>;
};

/**
 * A union type of router actions.
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
