import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { rootReducers, metaReducers } from '@example-app/reducers';

import { APP_ROUTES } from '@example-app/app.routing';
import { UserEffects, RouterEffects } from '@example-app/core/effects';
import { provideRouter, withHashLocation } from '@angular/router';
import * as fromAuth from '@example-app/auth/reducers';
import { AuthEffects } from './auth/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(APP_ROUTES, withHashLocation()),

    /**
     * provideStore() is imported once in the root providers, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    provideStore(rootReducers, {
      metaReducers,
      runtimeChecks: {
        // strictStateImmutability and strictActionImmutability are enabled by default
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store.
     */
    provideRouterStore(),

    /**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     *
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     *
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    provideStoreDevtools({
      name: 'NgRx Book Store App',
      // In a production build you would want to disable the Store Devtools
      // logOnly: !isDevMode(),
    }),

    /**
     * The provideEffects() function is used to register effect classes
     * so they are initialized when the application starts.
     */
    provideEffects(UserEffects, RouterEffects, AuthEffects),

    /**
     * The Auth state is provided here to ensure that the login details
     * are available as soon as the application starts.
     */
    provideState({
      name: fromAuth.authFeatureKey,
      reducer: fromAuth.reducers,
    }),
  ],
};
