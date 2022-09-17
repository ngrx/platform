import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';

import { environment } from './environments/environment';
import { AppEffects } from './app/app.effects';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ router: routerReducer }),
    importProvidersFrom(
      RouterModule.forRoot(
        [
          {
            path: 'feature',
            loadChildren: () =>
              import('./app/lazy/feature.routes').then((m) => m.routes),
          },
        ],
        { initialNavigation: 'enabledBlocking' }
      )
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      name: 'NgRx Standalone App',
    }),
    provideRouterStore(),
    provideEffects([AppEffects]),
  ],
});