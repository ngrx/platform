import { ENVIRONMENT_INITIALIZER, ErrorHandler, Provider } from '@angular/core';
import { StoreRouterConnectingService } from './store_router_connecting.service';
import { ACTIVE_RUNTIME_CHECKS, RuntimeChecks, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ROUTER_CONFIG, StoreRouterConfig } from './router_store_config';
import { RouterStateSerializer } from './serializers/base';
import { SerializedRouterStateSnapshot } from './serializers/full_serializer';

export const _initRouterStore: Provider = {
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
};
