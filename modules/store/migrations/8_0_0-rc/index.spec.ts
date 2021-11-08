import { normalize } from '@angular-devkit/core';
import { EmptyTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

describe('Migration to version 8.0.0 rc', () => {
  describe('removes the usage of the storeFreeze meta-reducer', () => {
    /* eslint-disable */
    const fixtures = [
      {
        description: 'removes the ngrx-store-freeze import',
        input: `import { storeFreeze } from 'ngrx-store-freeze';`,
        expected: ``,
      },
      {
        description: 'removes the usage of storeFeeze',
        input: `import { storeFreeze } from 'ngrx-store-freeze';
          const metaReducers = environment.production ? [] : [storeFreeze]`,
        expected: `
          const metaReducers = environment.production ? [] : []`,
      },
      {
        description:
          'removes the usage of storeFeeze with an appending meta-reducer',
        input: `import { storeFreeze } from 'ngrx-store-freeze';
          const metaReducers = environment.production ? [] : [storeFreeze, foo]`,
        expected: `
          const metaReducers = environment.production ? [] : [foo]`,
      },
      {
        description:
          'removes the usage of storeFeeze with an prepending meta-reducer',
        input: `import { storeFreeze } from 'ngrx-store-freeze';
          const metaReducers = environment.production ? [] : [foo, storeFreeze]`,
        expected: `
          const metaReducers = environment.production ? [] : [foo]`,
      },
      {
        description: 'removes the usage of storeFeeze in between meta-reducers',
        input: `import { storeFreeze } from 'ngrx-store-freeze';
          const metaReducers = environment.production ? [] : [foo, storeFreeze, bar]`,
        expected: `
          const metaReducers = environment.production ? [] : [foo, bar]`,
      },
    ];
    /* eslint-enable */

    const reducerPath = normalize('reducers/index.ts');

    for (const { description, input, expected } of fixtures) {
      it(description, async () => {
        const tree = new UnitTestTree(new EmptyTree());
        // we need a package.json, it will throw otherwise because we're trying to remove ngrx-store-freeze as a dep
        tree.create('/package.json', JSON.stringify({}));
        tree.create(reducerPath, input);

        const schematicRunner = createSchematicsRunner();
        await schematicRunner
          .runSchematicAsync('ngrx-store-migration-03', {}, tree)
          .toPromise();
        await schematicRunner.engine.executePostTasks().toPromise();

        const actual = tree.readContent(reducerPath);
        expect(actual).toBe(expected);
      });
    }
  });

  describe('StoreModule.forRoot()', () => {
    /* eslint-disable */
    const fixtures = [
      {
        description:
          'enables strictStateImmutability and strictActionImmutability runtime checks with no store config',
        input: `
        @NgModule({
          imports: [
            StoreModule.forRoot(ROOT_REDUCERS),
          ],
          bootstrap: [AppComponent],
        })
        export class AppModule {}`,
        isStoreFreezeUsed: true,
        expected: `
        @NgModule({
          imports: [
            StoreModule.forRoot(ROOT_REDUCERS, { runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true }}),
          ],
          bootstrap: [AppComponent],
        })
        export class AppModule {}`,
      },
      {
        description:
          'enables strictStateImmutability and strictActionImmutability runtime checks with store config',
        input: `
        @NgModule({
          imports: [
            StoreModule.forRoot(ROOT_REDUCERS, { metaReducers }),
          ],
          bootstrap: [AppComponent],
        })
        export class AppModule {}`,
        isStoreFreezeUsed: true,
        expected: `
        @NgModule({
          imports: [
            StoreModule.forRoot(ROOT_REDUCERS, { metaReducers, runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true } }),
          ],
          bootstrap: [AppComponent],
        })
        export class AppModule {}`,
      },
      {
        description:
          'enables strictStateImmutability and strictActionImmutability runtime checks with store config ending with a comma',
        input: `
        @NgModule({
          imports: [
            StoreModule.forRoot(ROOT_REDUCERS, {
              metaReducers,
            }),
          ],
          bootstrap: [AppComponent],
        })
        export class AppModule {}`,
        isStoreFreezeUsed: true,
        expected: `
        @NgModule({
          imports: [
            StoreModule.forRoot(ROOT_REDUCERS, {
              metaReducers, runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true },
            }),
          ],
          bootstrap: [AppComponent],
        })
        export class AppModule {}`,
      },
      {
        description:
          'enables strictStateImmutability and strictActionImmutability runtime checks with an empty store config',
        input: `
        @NgModule({
          imports: [
            StoreModule.forRoot(ROOT_REDUCERS, { }),
          ],
          bootstrap: [AppComponent],
        })
        export class AppModule {}`,
        isStoreFreezeUsed: true,
        expected: `
        @NgModule({
          imports: [
            StoreModule.forRoot(ROOT_REDUCERS, { runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true } }),
          ],
          bootstrap: [AppComponent],
        })
        export class AppModule {}`,
      },
      {
        description:
          'does not add runtime checks when store-freeze was not used',
        input: `
        @NgModule({
          imports: [
            StoreModule.forRoot(ROOT_REDUCERS, { metaReducers }),
          ],
          bootstrap: [AppComponent],
        })
        export class AppModule {}`,
        isStoreFreezeUsed: false,
        expected: `
        @NgModule({
          imports: [
            StoreModule.forRoot(ROOT_REDUCERS, { metaReducers }),
          ],
          bootstrap: [AppComponent],
        })
        export class AppModule {}`,
      },
    ];
    /* eslint-enable */

    const appModulePath = normalize('app.module.ts');

    for (const {
      description,
      input,
      isStoreFreezeUsed,
      expected,
    } of fixtures) {
      it(description, async () => {
        const tree = new UnitTestTree(new EmptyTree());
        // we need a package.json, it will throw otherwise because we're trying to remove ngrx-store-freeze as a dep
        tree.create('/package.json', JSON.stringify({}));
        if (isStoreFreezeUsed) {
          // we need this file to "trigger" the runtime additions
          tree.create(
            'reducer.ts',
            'import { storeFreeze } from "ngrx-store-freeze";'
          );
        }
        tree.create(appModulePath, input);

        const schematicRunner = createSchematicsRunner();
        await schematicRunner
          .runSchematicAsync('ngrx-store-migration-03', {}, tree)
          .toPromise();
        await schematicRunner.engine.executePostTasks().toPromise();

        const actual = tree.readContent(appModulePath);
        expect(actual).toBe(expected);
      });
    }
  });

  describe('package.json', () => {
    /* eslint-disable */
    const fixtures = [
      {
        description: 'removes ngrx-store-freeze as a dependency',
        input: JSON.stringify({
          dependencies: {
            'ngrx-store-freeze': '^1.0.0',
          },
        }),
      },
      {
        description: 'removes ngrx-store-freeze as a dev dependency',
        input: JSON.stringify({
          devDependencies: {
            'ngrx-store-freeze': '^1.0.0',
          },
        }),
      },
      {
        description: 'does not throw when ngrx-store-freeze is not installed',
        input: JSON.stringify({
          dependencies: {},
          devDependencies: {},
        }),
      },
    ];
    /* eslint-enable */

    const packageJsonPath = normalize('package.json');

    for (const { description, input } of fixtures) {
      it(description, async () => {
        const tree = new UnitTestTree(new EmptyTree());
        tree.create(packageJsonPath, input);

        const schematicRunner = createSchematicsRunner();
        await schematicRunner
          .runSchematicAsync('ngrx-store-migration-03', {}, tree)
          .toPromise();
        await schematicRunner.engine.executePostTasks().toPromise();

        const actual = tree.readContent(packageJsonPath);
        expect(actual).not.toMatch(/ngrx-store-freeze/);
      });
    }
  });
});

function createSchematicsRunner() {
  const schematicRunner = new SchematicTestRunner(
    'migrations',
    require.resolve('../migration.json')
  );

  return schematicRunner;
}
