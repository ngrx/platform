import { Provider } from '@angular/core';
import {
  _createRouterConfig,
  _ROUTER_CONFIG,
  ROUTER_CONFIG,
  RouterState,
  StoreRouterConfig,
} from './router_store_config';
import {
  FullRouterStateSerializer,
  SerializedRouterStateSnapshot,
} from './serializers/full_serializer';
import { MinimalRouterStateSerializer } from './serializers/minimal_serializer';
import {
  BaseRouterStoreState,
  RouterStateSerializer,
} from './serializers/base';
import { _initRouterStore } from './init_router_store';

/**
 * Provider function to connect the RouterModule to the StoreModule
 *
 * Usage:
 *
 * ```typescript
 * bootstrapApplication(AppComponent, {
 *  providers: [
 *    provideRouterStore()
 *  ]
 * })
 * ```
 */
export function provideRouterStore<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
>(config: StoreRouterConfig<T> = {}): Provider[] {
  return [
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
    _initRouterStore,
  ];
}
