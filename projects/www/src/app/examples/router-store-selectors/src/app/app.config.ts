import { ApplicationConfig } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { isDevMode } from '@angular/core';
import { reducer } from './car/car.reducer';
import { CarComponent } from './car/car.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ cars: reducer, router: routerReducer }),
    provideRouter(
      [
        {
          path: ':carId',
          component: CarComponent,
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
  ],
};
