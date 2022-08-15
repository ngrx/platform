import {
  ENVIRONMENT_INITIALIZER,
  ErrorHandler,
  inject,
  Provider,
} from '@angular/core';
import { StoreRouterConnectingService } from './store_router_connecting.service';
import { ACTIVE_RUNTIME_CHECKS, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ROUTER_CONFIG, StoreRouterConfig } from './router_store_config';
import { RouterStateSerializer } from './serializers/base';

export const _initRouterStore: Provider = {
  provide: ENVIRONMENT_INITIALIZER,
  multi: true,
  useValue() {
    new StoreRouterConnectingService(
      inject(Store),
      inject(Router),
      inject(RouterStateSerializer),
      inject(ErrorHandler),
      inject<StoreRouterConfig>(ROUTER_CONFIG),
      inject(ACTIVE_RUNTIME_CHECKS)
    );
  },
};
