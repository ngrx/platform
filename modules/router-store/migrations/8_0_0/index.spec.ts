import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createPackageJson } from '@ngrx/schematics-core/testing/create-package';

describe('Router Store Migration 8_0_0', () => {
  let appTree: UnitTestTree;
  const collectionPath = path.join(__dirname, '../migration.json');
  const pkgName = 'router-store';

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

  it(`should import StoreRouterConnectingModule as StoreRouterConnectingModule.forRoot()`, async () => {
    const contents = `
      import { StoreRouterConnectingModule } from '@ngrx/router-store';
      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          /**
           * @ngrx/router-store keeps router state up-to-date in the store.
           */
          StoreRouterConnectingModule,
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
    const expected = `
      import { StoreRouterConnectingModule } from '@ngrx/router-store';
      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          /**
           * @ngrx/router-store keeps router state up-to-date in the store.
           */
          StoreRouterConnectingModule.forRoot(),
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

    appTree.create('./app.module.ts', contents);
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const newTree = await runner
      .runSchematicAsync(`ngrx-${pkgName}-migration-02`, {}, appTree)
      .toPromise();
    const file = newTree.readContent('app.module.ts');

    expect(file).toBe(expected);
  });

  it(`should not replace StoreRouterConnectingModule.forRoot()`, async () => {
    const contents = `
      import { StoreRouterConnectingModule } from '@ngrx/router-store';
      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          /**
           * @ngrx/router-store keeps router state up-to-date in the store.
           */
          StoreRouterConnectingModule.forRoot(),
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
    const expected = `
      import { StoreRouterConnectingModule } from '@ngrx/router-store';
      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          /**
           * @ngrx/router-store keeps router state up-to-date in the store.
           */
          StoreRouterConnectingModule.forRoot(),
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

    appTree.create('./app.module.ts', contents);
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const newTree = await runner
      .runSchematicAsync(`ngrx-${pkgName}-migration-02`, {}, appTree)
      .toPromise();
    const file = newTree.readContent('app.module.ts');

    expect(file).toBe(expected);
  });
});
