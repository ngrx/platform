import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { Selector } from '@ngrx/store';
import { RouterReducerState } from './reducer';
import {
  RouterStateSerializer,
  BaseRouterStoreState,
} from './serializers/base';
import {
  FullRouterStateSerializer,
  SerializedRouterStateSnapshot,
} from './serializers/full_serializer';
import { MinimalRouterStateSerializer } from './serializers/minimal_serializer';
import { StoreRouterConnectingService } from './store_router_connecting.service';

export type StateKeyOrSelector<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
> = string | Selector<any, RouterReducerState<T>>;

/**
 * Minimal = Serializes the router event with MinimalRouterStateSerializer
 * Full = Serializes the router event with FullRouterStateSerializer
 */
export const enum RouterState {
  Full,
  Minimal,
}

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
   * Decides which router serializer should be used, if there is none provided, and the metadata on the dispatched @ngrx/router-store action payload.
   * Set to `Minimal` to use the `MinimalRouterStateSerializer` and to set a minimal router event with the navigation id and url as payload.
   * Set to `Full` to use the `FullRouterStateSerializer` and to set the angular router events as payload.
   */
  routerState?: RouterState;
}

export enum NavigationActionTiming {
  PreActivation = 1,
  PostActivation = 2,
}

export const _ROUTER_CONFIG = new InjectionToken(
  '@ngrx/router-store Internal Configuration'
);
export const ROUTER_CONFIG = new InjectionToken(
  '@ngrx/router-store Configuration'
);
export const DEFAULT_ROUTER_FEATURENAME = 'router';

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
 * Connects RouterModule with StoreModule.
 *
 * During the navigation, before any guards or resolvers run, the router will dispatch
 * a ROUTER_NAVIGATION action, which has the following signature:
 *
 * ```
 * export type RouterNavigationPayload = {
 *   routerState: SerializedRouterStateSnapshot,
 *   event: RoutesRecognized
 * }
 * ```
 *
 * Either a reducer or an effect can be invoked in response to this action.
 * If the invoked reducer throws, the navigation will be canceled.
 *
 * If navigation gets canceled because of a guard, a ROUTER_CANCEL action will be
 * dispatched. If navigation results in an error, a ROUTER_ERROR action will be dispatched.
 *
 * Both ROUTER_CANCEL and ROUTER_ERROR contain the store state before the navigation
 * which can be used to restore the consistency of the store.
 *
 * Usage:
 *
 * ```typescript
 * @NgModule({
 *   declarations: [AppCmp, SimpleCmp],
 *   imports: [
 *     BrowserModule,
 *     StoreModule.forRoot(mapOfReducers),
 *     RouterModule.forRoot([
 *       { path: '', component: SimpleCmp },
 *       { path: 'next', component: SimpleCmp }
 *     ]),
 *     StoreRouterConnectingModule.forRoot()
 *   ],
 *   bootstrap: [AppCmp]
 * })
 * export class AppModule {
 * }
 * ```
 */
@NgModule({})
export class StoreRouterConnectingModule {
  static forRoot<
    T extends BaseRouterStoreState = SerializedRouterStateSnapshot
  >(
    config: StoreRouterConfig<T> = {}
  ): ModuleWithProviders<StoreRouterConnectingModule> {
    return {
      ngModule: StoreRouterConnectingModule,
      providers: [
        { provide: _ROUTER_CONFIG, useValue: config },
        {
          provide: ROUTER_CONFIG,
          useFactory: _createRouterConfig,
          deps: [_ROUTER_CONFIG],
        },
        {
          provide: RouterStateSerializer,
          useClass: config.serializer
            ? config.serializer
            : config.routerState === RouterState.Full
            ? FullRouterStateSerializer
            : MinimalRouterStateSerializer,
        },
      ],
    };
  }

  constructor(storeRouterConnectingService: StoreRouterConnectingService) {}
}
