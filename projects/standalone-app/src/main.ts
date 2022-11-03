import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEntityData } from '@ngrx/data';
import { EntityMetadata } from '@ngrx/data';
import { Story } from './app/story';

import { AppComponent } from './app/app.component';

import { environment } from './environments/environment';
import { AppEffects } from './app/app.effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { fakeBackendInterceptorFn } from './app/board/fake-backend-interceptor.service';

if (environment.production) {
  enableProdMode();
}

export const storyEntityMetadata: EntityMetadata<Story> = {
  entityName: 'Story',
  selectId: (entity: Story): string => entity.storyId,
  sortComparer: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  filterFn: (entities, pattern) =>
    entities.filter(
      (entity) =>
        entity.title?.includes(pattern) || entity.title?.includes(pattern)
    ),
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([fakeBackendInterceptorFn()])),
    provideStore({ router: routerReducer }),
    provideRouter(
      [
        {
          path: 'feature',
          loadChildren: () =>
            import('./app/lazy/feature.routes').then((m) => m.routes),
        },
        {
          path: 'board',
          loadChildren: () =>
            import('./app/board/board.routes').then((m) => m.routes),
        },
      ],
      withEnabledBlockingInitialNavigation()
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      name: 'NgRx Standalone App',
    }),
    provideRouterStore(),
    provideEffects(AppEffects),
    provideEntityData({
      entityMetadata: {
        Story: storyEntityMetadata,
      },
      pluralNames: {
        Story: 'stories',
      },
    }),
  ],
});
