import {
  BaseRouterStoreState,
  FullRouterStateSerializer,
  MinimalRouterStateSerializer,
  ROUTER_CONFIG,
  RouterState,
  RouterStateSerializer,
  SerializedRouterStateSnapshot,
  StoreRouterConfig,
} from '@ngrx/router-store';
import { ENVIRONMENT_INITIALIZER, ErrorHandler, Provider } from '@angular/core';
import { _createRouterConfig, _ROUTER_CONFIG } from './router_store_module';
import { StoreRouterConnectingService } from './store_router_connecting.service';
import { ACTIVE_RUNTIME_CHECKS, RuntimeChecks, Store } from '@ngrx/store';
import { Router } from '@angular/router';

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
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      deps: [
        Store,
        Router,
        RouterStateSerializer,
        ErrorHandler,
        ROUTER_CONFIG,
        ACTIVE_RUNTIME_CHECKS,
      ],
      useValue(
        store: Store,
        router: Router,
        serializer: RouterStateSerializer<SerializedRouterStateSnapshot>,
        errorHandler: ErrorHandler,
        config: StoreRouterConfig,
        activeRuntimeChecks: RuntimeChecks
      ) {
        return new StoreRouterConnectingService(
          store,
          router,
          serializer,
          errorHandler,
          config,
          activeRuntimeChecks
        );
      },
    },
  ];
}
