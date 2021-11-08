import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createPackageJson } from '@ngrx/schematics-core/testing/create-package';

describe('Router Store Migration 9_0_0', () => {
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

  describe('Adds the default serializer when none is set', () => {
    it(`should use the default serializer if none was present (empty)`, () => {
      const input = `
      import { StoreRouterConnectingModule } from '@ngrx/router-store';
      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          StoreRouterConnectingModule.forRoot(),
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
      const expected = `
      import { StoreRouterConnectingModule, DefaultRouterStateSerializer } from '@ngrx/router-store';
      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer }),
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

      test(input, expected);
    });

    it(`should use the default serializer if none was present (with props)`, () => {
      const input = `
      import { StoreRouterConnectingModule } from '@ngrx/router-store';
      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          StoreRouterConnectingModule.forRoot({ key: 'router' }),
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
      const expected = `
      import { StoreRouterConnectingModule, DefaultRouterStateSerializer } from '@ngrx/router-store';
      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer, key: 'router' }),
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

      test(input, expected);
    });

    it(`should not run the migration if there was a serializer set`, () => {
      const input = `
      import { StoreRouterConnectingModule } from '@ngrx/router-store';
      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          StoreRouterConnectingModule.forRoot({ serializer: CustomSerializer }),
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
      const expected = input;

      test(input, expected);
    });

    it(`should not run the migration if there was a routerState set`, () => {
      const input = `
      import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          StoreRouterConnectingModule.forRoot({ routerState: RouterState.Minimal }),
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
      const expected = input;

      test(input, expected);
    });

    async function test(input: string, expected: string) {
      appTree.create('./app.module.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner
        .runSchematicAsync(`ngrx-${pkgName}-migration-03`, {}, appTree)
        .toPromise();
      const file = newTree.readContent('app.module.ts');

      expect(file).toBe(expected);
    }
  });
});
