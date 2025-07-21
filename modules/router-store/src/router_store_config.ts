import { InjectionToken } from '@angular/core';
import { Selector } from '@ngrx/store';
import { RouterReducerState } from './reducer';
import {
  BaseRouterStoreState,
  RouterStateSerializer,
} from './serializers/base';
import { SerializedRouterStateSnapshot } from './serializers/full_serializer';
import { MinimalRouterStateSerializer } from './serializers/minimal_serializer';

/**
 * A type representing either a state key string or a selector function.
 *
 * @public
 */
export type StateKeyOrSelector<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = string | Selector<any, RouterReducerState<T>>;

/**
 * Defines when navigation actions should be dispatched.
 *
 * @public
 */
export enum NavigationActionTiming {
  PreActivation = 1,
  PostActivation = 2,
}

/**
 * The default feature name for the router store.
 *
 * @public
 */
export const DEFAULT_ROUTER_FEATURENAME = 'router';

/**
 * Internal injection token for router store configuration.
 *
 * @public
 */
export const _ROUTER_CONFIG = new InjectionToken(
  '@ngrx/router-store Internal Configuration'
);

/**
 * Injection token for router store configuration.
 *
 * @public
 */
export const ROUTER_CONFIG = new InjectionToken(
  '@ngrx/router-store Configuration'
);

/**
 * Minimal = Serializes the router event with MinimalRouterStateSerializer
 * Full = Serializes the router event with FullRouterStateSerializer
 *
 * @public
 */
export enum RouterState {
  Full,
  Minimal,
}

/**
 * Creates router configuration with default values.
 *
 * @param config - The configuration to merge with defaults.
 * @returns The complete router configuration.
 *
 * @public
 */
export function _createRouterConfig(
  config: StoreRouterConfig
): StoreRouterConfig {
  return {
    stateKey: DEFAULT_ROUTER_FEATURENAME,
    serializer: MinimalRouterStateSerializer,
    navigationActionTiming: NavigationActionTiming.PreActivation,
    ...config,
  };
}

/**
 * Configuration interface for the router store.
 *
 * @public
 */
export interface StoreRouterConfig<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> {
  stateKey?: StateKeyOrSelector<T>;
  serializer?: new (...args: any[]) => RouterStateSerializer;
  /**
   * By default, ROUTER_NAVIGATION is dispatched before guards and resolvers run.
   * Therefore, the action could run too soon, for example
   * there may be a navigation cancel due to a guard saying the navigation is not allowed.
   * To run ROUTER_NAVIGATION after guards and resolvers,
   * set this property to NavigationActionTiming.PostActivation.
   */
  navigationActionTiming?: NavigationActionTiming;
  /**
   * Decides which router serializer should be used, if there is none provided, and the metadata on the dispatched \@ngrx/router-store action payload.
   * Set to `Minimal` to use the `MinimalRouterStateSerializer` and to set a minimal router event with the navigation id and url as payload.
   * Set to `Full` to use the `FullRouterStateSerializer` and to set the angular router events as payload.
   */
  routerState?: RouterState;
}
