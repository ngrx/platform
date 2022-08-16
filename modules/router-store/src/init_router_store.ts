import { ENVIRONMENT_INITIALIZER, inject, Provider } from '@angular/core';
import { StoreRouterConnectingService } from './store_router_connecting.service';

/**
 * Initializer for the router-store that ensures the initialization logic is run alongside environment
 * initialization.
 */
export const _initRouterStore: Provider[] = [
  {
    provide: ENVIRONMENT_INITIALIZER,
    multi: true,
    useFactory() {
      return () => {
        inject(StoreRouterConnectingService);
      };
    },
  },
  StoreRouterConnectingService,
];
