import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createPackageJson } from '@ngrx/schematics-core/testing/create-package';
import { waitForAsync } from '@angular/core/testing';

describe('Router Store Migration 14_0_0', () => {
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

  describe('Rename serializers', () => {
    it(
      `should rename the DefaultRouterStateSerializer to FullRouterStateSerializer`,
      waitForAsync(async () => {
        const input = `
      import { DefaultRouterStateSerializer } from '@ngrx/router-store';

      const fullSerializer: DefaultRouterStateSerializer;

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
        const expected = `
      import { FullRouterStateSerializer } from '@ngrx/router-store';

      const fullSerializer: FullRouterStateSerializer;

      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          StoreRouterConnectingModule.forRoot({ serializer: FullRouterStateSerializer, key: 'router' }),
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

        appTree.create('./app.module.ts', input);
        const runner = new SchematicTestRunner('schematics', collectionPath);

        const newTree = await runner
          .runSchematicAsync(`ngrx-${pkgName}-migration-04`, {}, appTree)
          .toPromise();
        const file = newTree.readContent('app.module.ts');

        expect(file).toBe(expected);
      })
    );
  });
});
