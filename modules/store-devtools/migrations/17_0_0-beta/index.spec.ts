import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createPackageJson } from '@ngrx/schematics-core/testing/create-package';
import { waitForAsync } from '@angular/core/testing';

describe('DevTools Migration 17_0_0-beta', () => {
  let appTree: UnitTestTree;
  const collectionPath = path.join(
    process.cwd(),
    'dist/modules/store-devtools/migrations/migration.json'
  );
  const pkgName = 'store-devtools';
  const migrationname = `ngrx-${pkgName}-migration-17-0-0-beta`;

  beforeEach(() => {
    appTree = new UnitTestTree(Tree.empty());
    appTree.create(
      '/tsconfig.json',
      `
        {
          "include": [**./*.ts"]
        }
       `
    );
    createPackageJson('', pkgName, appTree);
  });

  describe('StoreDevtoolsModule.instrument', () => {
    it(`should add connectInZone to config properties (previous property ends with a comma)`, waitForAsync(async () => {
      const input = `
      import { StoreDevtoolsModule } from '@ngrx/store-devtools';

      @NgModule({
        imports: [
          StoreDevtoolsModule.instrument({
            name: 'DevTools Name',
          }),
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
      const expected = `
      import { StoreDevtoolsModule } from '@ngrx/store-devtools';

      @NgModule({
        imports: [
          StoreDevtoolsModule.instrument({
            name: 'DevTools Name',
          connectInZone: true}),
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

      appTree.create('./app.module.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner.runSchematic(migrationname, {}, appTree);
      const file = newTree.readContent('app.module.ts');

      expect(file).toBe(expected);
    }));

    it(`should add connectInZone to config properties (previous property doesn't end with a comma)`, waitForAsync(async () => {
      const input = `
      import { StoreDevtoolsModule } from '@ngrx/store-devtools';

      @NgModule({
        imports: [
          StoreDevtoolsModule.instrument({
            name: 'DevTools Name'
          }),
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
      const expected = `
      import { StoreDevtoolsModule } from '@ngrx/store-devtools';

      @NgModule({
        imports: [
          StoreDevtoolsModule.instrument({
            name: 'DevTools Name'
          , connectInZone: true}),
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

      appTree.create('./app.module.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner.runSchematic(migrationname, {}, appTree);
      const file = newTree.readContent('app.module.ts');

      expect(file).toBe(expected);
    }));

    it(`should add connectInZone to empty config properties`, waitForAsync(async () => {
      const input = `
      import { StoreDevtoolsModule } from '@ngrx/store-devtools';

      @NgModule({
        imports: [
          StoreDevtoolsModule.instrument({
          }),
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
      const expected = `
      import { StoreDevtoolsModule } from '@ngrx/store-devtools';

      @NgModule({
        imports: [
          StoreDevtoolsModule.instrument({
          connectInZone: true}),
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

      appTree.create('./app.module.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner.runSchematic(migrationname, {}, appTree);
      const file = newTree.readContent('app.module.ts');

      expect(file).toBe(expected);
    }));

    it(`should add connectInZone to empty config`, waitForAsync(async () => {
      const input = `
      import { StoreDevtoolsModule } from '@ngrx/store-devtools';

      @NgModule({
        imports: [
          StoreDevtoolsModule.instrument(),
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
      const expected = `
      import { StoreDevtoolsModule } from '@ngrx/store-devtools';

      @NgModule({
        imports: [
          StoreDevtoolsModule.instrument({connectInZone: true}),
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

      appTree.create('./app.module.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner.runSchematic(migrationname, {}, appTree);
      const file = newTree.readContent('app.module.ts');

      expect(file).toBe(expected);
    }));

    it(`renames connectOutsideZone to connectInZone and inverts its value`, waitForAsync(async () => {
      const input = `
      import { StoreDevtoolsModule } from '@ngrx/store-devtools';

      @NgModule({
        imports: [
          StoreDevtoolsModule.instrument({
            connectOutsideZone: true,
          }),
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
      const expected = `
      import { StoreDevtoolsModule } from '@ngrx/store-devtools';

      @NgModule({
        imports: [
          StoreDevtoolsModule.instrument({
            connectInZone: false,
          }),
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

      appTree.create('./app.module.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner.runSchematic(migrationname, {}, appTree);
      const file = newTree.readContent('app.module.ts');

      expect(file).toBe(expected);
    }));
  });

  describe('bootstrapApplication', () => {
    it(`should add connectInZone to config properties (previous property ends with a comma)`, waitForAsync(async () => {
      const input = `
      import { provideStoreDevtools } from '@ngrx/store-devtools';

      bootstrapApplication(AppComponent, {
        providers: [
          provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
          }),
        ],
      });
    `;
      const expected = `
      import { provideStoreDevtools } from '@ngrx/store-devtools';

      bootstrapApplication(AppComponent, {
        providers: [
          provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
          connectInZone: true}),
        ],
      });
    `;

      appTree.create('./main.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner.runSchematic(migrationname, {}, appTree);
      const file = newTree.readContent('main.ts');

      expect(file).toBe(expected);
    }));

    it(`should add connectInZone to config properties (previous property doesn't end with a comma)`, waitForAsync(async () => {
      const input = `
      import { provideStoreDevtools } from '@ngrx/store-devtools';

      bootstrapApplication(AppComponent, {
        providers: [
          provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode()
          }),
        ],
      });
    `;
      const expected = `
      import { provideStoreDevtools } from '@ngrx/store-devtools';

      bootstrapApplication(AppComponent, {
        providers: [
          provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode()
          , connectInZone: true}),
        ],
      });
    `;

      appTree.create('./main.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner.runSchematic(migrationname, {}, appTree);
      const file = newTree.readContent('main.ts');

      expect(file).toBe(expected);
    }));

    it(`should add connectInZone to empty config properties`, waitForAsync(async () => {
      const input = `
      import { provideStoreDevtools } from '@ngrx/store-devtools';

      bootstrapApplication(AppComponent, {
        providers: [
          provideStoreDevtools({ }),
        ],
      });
    `;
      const expected = `
      import { provideStoreDevtools } from '@ngrx/store-devtools';

      bootstrapApplication(AppComponent, {
        providers: [
          provideStoreDevtools({ connectInZone: true}),
        ],
      });
    `;

      appTree.create('./main.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner.runSchematic(migrationname, {}, appTree);
      const file = newTree.readContent('main.ts');

      expect(file).toBe(expected);
    }));

    it(`should add connectInZone to empty config`, waitForAsync(async () => {
      const input = `
      import { provideStoreDevtools } from '@ngrx/store-devtools';

      bootstrapApplication(AppComponent, {
        providers: [
          provideStoreDevtools(),
        ],
      });
    `;
      const expected = `
      import { provideStoreDevtools } from '@ngrx/store-devtools';

      bootstrapApplication(AppComponent, {
        providers: [
          provideStoreDevtools({connectInZone: true}),
        ],
      });
    `;

      appTree.create('./main.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner.runSchematic(migrationname, {}, appTree);
      const file = newTree.readContent('main.ts');

      expect(file).toBe(expected);
    }));

    it(`renames connectOutsideZone to connectInZone and inverts its value`, waitForAsync(async () => {
      const input = `
      import { provideStoreDevtools } from '@ngrx/store-devtools';

      bootstrapApplication(AppComponent, {
        providers: [
          provideStoreDevtools({ connectOutsideZone: someValue }),
        ],
      });
    `;
      const expected = `
      import { provideStoreDevtools } from '@ngrx/store-devtools';

      bootstrapApplication(AppComponent, {
        providers: [
          provideStoreDevtools({ connectInZone: !someValue }),
        ],
      });
    `;

      appTree.create('./main.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner.runSchematic(migrationname, {}, appTree);
      const file = newTree.readContent('main.ts');

      expect(file).toBe(expected);
    }));
  });
});
