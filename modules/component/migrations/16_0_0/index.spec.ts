import * as path from 'path';
import {} from '@angular/core/testing';
import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createPackageJson } from '@ngrx/schematics-core/testing/create-package';

describe('Component Migration 16_0_0', () => {
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

  [
    { module: 'LetModule', declarable: 'LetDirective' },
    {
      module: 'PushModule',
      declarable: 'PushPipe',
    },
  ].forEach(({ module, declarable }) => {
    describe(`${module} => ${declarable}`, () => {
      it(`should replace the ${module} in NgModule with ${declarable}`, async () => {
        const input = `
          import { ${module} } from '@ngrx/component';

          @NgModule({
            imports: [
              AuthModule,
              AppRoutingModule,
              ${module},
              CoreModule,
            ],
            exports: [${module}],
            bootstrap: [AppComponent]
          })
          export class AppModule {}
        `;
        const expected = `
          import { ${declarable} } from '@ngrx/component';

          @NgModule({
            imports: [
              AuthModule,
              AppRoutingModule,
              ${declarable},
              CoreModule,
            ],
            exports: [${declarable}],
            bootstrap: [AppComponent]
          })
          export class AppModule {}
        `;

        appTree.create('./app.module.ts', input);
        const runner = new SchematicTestRunner('schematics', collectionPath);

        const newTree = await runner.runSchematic(
          `ngrx-${pkgName}-migration-16`,
          {},
          appTree
        );
        const file = newTree.readContent('app.module.ts');

        expect(file).toBe(expected);
      });

      it(`should replace the ${module} in standalone component with ${declarable}`, async () => {
        const input = `
          import { ${module} } from '@ngrx/component';

          @Component({
            imports: [
              AuthModule,
              ${module}
            ]
          })
          export class SomeStandaloneComponent {}
        `;
        const expected = `
          import { ${declarable} } from '@ngrx/component';

          @Component({
            imports: [
              AuthModule,
              ${declarable}
            ]
          })
          export class SomeStandaloneComponent {}
        `;

        appTree.create('./app.module.ts', input);
        const runner = new SchematicTestRunner('schematics', collectionPath);

        const newTree = await runner.runSchematic(
          `ngrx-${pkgName}-migration-16`,
          {},
          appTree
        );
        const file = newTree.readContent('app.module.ts');

        expect(file).toBe(expected);
      });

      it(`should not remove the ${module} JS import when used as a type`, async () => {
        const input = `
          import { ${module} } from '@ngrx/component';

          const module: ${module};

          @NgModule({
            imports: [
              AuthModule,
              AppRoutingModule,
              ${module},
              CoreModule
            ],
            bootstrap: [AppComponent]
          })
          export class AppModule {}
        `;
        const expected = `
          import { ${module}, ${declarable} } from '@ngrx/component';

          const module: ${module};

          @NgModule({
            imports: [
              AuthModule,
              AppRoutingModule,
              ${declarable},
              CoreModule
            ],
            bootstrap: [AppComponent]
          })
          export class AppModule {}
        `;

        appTree.create('./app.module.ts', input);
        const runner = new SchematicTestRunner('schematics', collectionPath);

        const newTree = await runner.runSchematic(
          `ngrx-${pkgName}-migration-16`,
          {},
          appTree
        );
        const file = newTree.readContent('app.module.ts');

        expect(file).toBe(expected);
      });
    });
  });
});
