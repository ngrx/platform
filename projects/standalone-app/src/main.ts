import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideStore(),
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
      ),
      StoreDevtoolsModule.instrument()
    ),
  ],
});
