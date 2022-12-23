import { tags } from '@angular-devkit/core';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createWorkspace } from '@ngrx/schematics-core/testing';

describe('Effects Migration 15_0_0-beta', () => {
  const collectionPath = path.join(__dirname, '../migration.json');
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('replace array in provideEffects', async () => {
    const input = tags.stripIndent`
        import { enableProdMode, isDevMode } from '@angular/core';
        import { bootstrapApplication } from '@angular/platform-browser';
        import {
          provideRouter,
          withEnabledBlockingInitialNavigation,
        } from '@angular/router';
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
            provideRouter(
              [
                {
                  path: 'feature',
                  loadChildren: () =>
                    import('./app/lazy/feature.routes').then((m) => m.routes),
                  providers: [
                    provideEffects([]),
                    provideEffects([AppEffects]),
                    provideEffects([AppEffects1, AppEffect2]),
                  ]
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
            provideEffects([]),
            provideEffects([AppEffects]),
            provideEffects([AppEffects1,AppEffect2]),
          ],
        });
      `;

    const expected = tags.stripIndent`
        import { enableProdMode, isDevMode } from '@angular/core';
        import { bootstrapApplication } from '@angular/platform-browser';
        import {
          provideRouter,
          withEnabledBlockingInitialNavigation,
        } from '@angular/router';
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
            provideRouter(
              [
                {
                  path: 'feature',
                  loadChildren: () =>
                    import('./app/lazy/feature.routes').then((m) => m.routes),
                  providers: [
                    provideEffects(),
                    provideEffects(AppEffects),
                    provideEffects(AppEffects1, AppEffect2),
                  ]
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
            provideEffects(),
            provideEffects(AppEffects),
            provideEffects(AppEffects1, AppEffect2),
          ],
        });
      `;

    appTree.create('main.ts', input);

    const tree = await schematicRunner
      .runSchematicAsync(`ngrx-effects-migration-15-beta`, {}, appTree)
      .toPromise();

    const actual = tree.readContent('main.ts');

    expect(actual).toBe(expected);
  });
});
