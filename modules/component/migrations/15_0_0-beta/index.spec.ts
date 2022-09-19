import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createPackageJson } from '@ngrx/schematics-core/testing/create-package';
import { waitForAsync } from '@angular/core/testing';

describe('Component Migration 15_0_0-beta', () => {
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
      `should replace the ReactiveComponentModule in NgModules with LetModule and PushModule`,
      waitForAsync(async () => {
        const input = `
      import { ReactiveComponentModule } from '@ngrx/component';

      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          ReactiveComponentModule,
          CoreModule,
        ],
        exports: [ReactiveComponentModule],
        bootstrap: [AppComponent]
      })
      export class AppModule {}
    `;
        const expected = `
      import { LetModule, PushModule } from '@ngrx/component';

      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          LetModule, PushModule,
          CoreModule,
        ],
        exports: [LetModule, PushModule],
        bootstrap: [AppComponent]
      })
      export class AppModule {}
    `;

        appTree.create('./app.module.ts', input);
        const runner = new SchematicTestRunner('schematics', collectionPath);

        const newTree = await runner
          .runSchematicAsync(`ngrx-${pkgName}-migration-15-beta`, {}, appTree)
          .toPromise();
        const file = newTree.readContent('app.module.ts');

        expect(file).toBe(expected);
      })
    );
    it(
      `should replace the ReactiveComponentModule in standalone components with LetModule and PushModule`,
      waitForAsync(async () => {
        const input = `
      import { ReactiveComponentModule } from '@ngrx/component';

      @Component({
        imports: [
          AuthModule,
          ReactiveComponentModule
        ]
      })
      export class SomeStandaloneComponent {}
    `;
        const expected = `
      import { LetModule, PushModule } from '@ngrx/component';

      @Component({
        imports: [
          AuthModule,
          LetModule, PushModule
        ]
      })
      export class SomeStandaloneComponent {}
    `;

        appTree.create('./app.module.ts', input);
        const runner = new SchematicTestRunner('schematics', collectionPath);

        const newTree = await runner
          .runSchematicAsync(`ngrx-${pkgName}-migration-15-beta`, {}, appTree)
          .toPromise();
        const file = newTree.readContent('app.module.ts');

        expect(file).toBe(expected);
      })
    );
    it(
      `should not remove the ReactiveComponentModule JS import when used as a type`,
      waitForAsync(async () => {
        const input = `
      import { ReactiveComponentModule } from '@ngrx/component';

      const reactiveComponentModule: ReactiveComponentModule;

      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          ReactiveComponentModule,
          CoreModule
        ],
        bootstrap: [AppComponent]
      })
      export class AppModule {}
    `;
        const expected = `
      import { ReactiveComponentModule, LetModule, PushModule } from '@ngrx/component';

      const reactiveComponentModule: ReactiveComponentModule;

      @NgModule({
        imports: [
          AuthModule,
          AppRoutingModule,
          LetModule, PushModule,
          CoreModule
        ],
        bootstrap: [AppComponent]
      })
      export class AppModule {}
    `;

        appTree.create('./app.module.ts', input);
        const runner = new SchematicTestRunner('schematics', collectionPath);

        const newTree = await runner
          .runSchematicAsync(`ngrx-${pkgName}-migration-15-beta`, {}, appTree)
          .toPromise();
        const file = newTree.readContent('app.module.ts');

        expect(file).toBe(expected);
      })
    );
  });
});
