import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createPackageJson } from '@ngrx/schematics-core/testing/create-package';
import { waitForAsync } from '@angular/core/testing';

describe('Component Store Migration 14_1_0', () => {
  let appTree: UnitTestTree;
  const collectionPath = path.join(__dirname, '../migration.json');
  const pkgName = 'component';

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

  describe('Replace ReactiveComponentModule', () => {
    it(
      `should replace the ReactiveComponentModule with LetModule and PushModule`,
      waitForAsync(async () => {
        const input = `
      import { ReactiveComponentModule } from '@ngrx/component';

      const reactiveComponentModule: ReactiveComponentModule;

      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          ReactiveComponentModule,
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;
        const expected = `
      import { LetModule, PushModule } from '@ngrx/component';

      const reactiveComponentModule: ReactiveComponentModule;

      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          LetModule, PushModule,
          CoreModule,
        ],
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

        appTree.create('./app.module.ts', input);
        const runner = new SchematicTestRunner('schematics', collectionPath);

        const newTree = await runner
          .runSchematicAsync(`ngrx-${pkgName}-migration-14-1`, {}, appTree)
          .toPromise();
        const file = newTree.readContent('app.module.ts');

        expect(file).toBe(expected);
      })
    );
  });
});
