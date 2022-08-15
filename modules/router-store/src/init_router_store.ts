import { ENVIRONMENT_INITIALIZER, inject, Provider } from '@angular/core';
import { StoreRouterConnectingService } from './store_router_connecting.service';

export const _initRouterStore: Provider[] = [
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useValue() {
      inject(StoreRouterConnectingService);
    },
  },
  StoreRouterConnectingService,
];
