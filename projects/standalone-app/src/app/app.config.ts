import { ApplicationConfig } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { AppEffects } from './app.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ router: routerReducer }),
    provideRouter(
      [
        {
          path: 'feature',
          loadChildren: () =>
            import('./lazy/feature.routes').then((m) => m.routes),
        },
      ],
      withEnabledBlockingInitialNavigation()
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      name: 'NgRx Standalone App',
    }),
    provideRouterStore(),
    provideEffects(AppEffects),
  ],
};
