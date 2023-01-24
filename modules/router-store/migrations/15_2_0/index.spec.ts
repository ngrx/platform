import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createPackageJson } from '@ngrx/schematics-core/testing/create-package';
import { waitForAsync } from '@angular/core/testing';

describe('Router Store Migration 15_2_0', () => {
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

  describe('Rename selector', () => {
    it(`renames getSelectors to getRouterSelectors as named imports`, waitForAsync(async () => {
      const input = `
        import { getSelectors } from '@ngrx/router-store';
        export const {
          selectCurrentRoute,
          selectQueryParams,
          selectQueryParam,
          selectRouteParams,
          selectRouteParam,
          selectRouteData,
          selectUrl,
          selectTitle,
        } = getSelectors(selectRouter);
      `;
      const expected = `
        import { getRouterSelectors } from '@ngrx/router-store';
        export const {
          selectCurrentRoute,
          selectQueryParams,
          selectQueryParam,
          selectRouteParams,
          selectRouteParam,
          selectRouteData,
          selectUrl,
          selectTitle,
        } = getSelectors(selectRouter);
      `;

      appTree.create('./selector.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner
        .runSchematicAsync(`ngrx-${pkgName}-migration-05`, {}, appTree)
        .toPromise();
      const file = newTree.readContent('selector.ts');

      expect(file).toBe(expected);
    }));

    it(`renames getSelectors to getRouterSelectors as namespace import`, waitForAsync(async () => {
      const input = `
        import * as routerStore from '@ngrx/router-store';
        export const selectors = routerStore.getSelectors(selectRouter);
      `;
      const expected = `
        import * as routerStore from '@ngrx/router-store';
        export const selectors = routerStore.getRouterSelectors(selectRouter);
      `;

      appTree.create('./selector.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner
        .runSchematicAsync(`ngrx-${pkgName}-migration-05`, {}, appTree)
        .toPromise();
      const file = newTree.readContent('selector.ts');

      expect(file).toBe(expected);
    }));

    it(`renames getSelectors to getRouterSelectors as namespace import with deconstruct`, waitForAsync(async () => {
      const input = `
        import * as routerStore from '@ngrx/router-store';
        export const {
          selectCurrentRoute,
          selectQueryParams,
          selectQueryParam,
          selectRouteParams,
          selectRouteParam,
          selectRouteData,
          selectUrl,
          selectTitle,
        } = routerStore.getSelectors(selectRouter);
      `;
      const expected = `
        import * as routerStore from '@ngrx/router-store';
        export const {
          selectCurrentRoute,
          selectQueryParams,
          selectQueryParam,
          selectRouteParams,
          selectRouteParam,
          selectRouteData,
          selectUrl,
          selectTitle,
        } = routerStore.getRouterSelectors(selectRouter);
      `;

      appTree.create('./selector.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner
        .runSchematicAsync(`ngrx-${pkgName}-migration-05`, {}, appTree)
        .toPromise();
      const file = newTree.readContent('selector.ts');

      expect(file).toBe(expected);
    }));

    it(`does not rename getSelectors if not imported from router-store`, waitForAsync(async () => {
      const input = `
        import { getSelectors } from '@ngrx/something';
        export const { selectCurrentRoute } = getSelectors(selectRouter);
      `;

      appTree.create('./selector.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner
        .runSchematicAsync(`ngrx-${pkgName}-migration-05`, {}, appTree)
        .toPromise();
      const file = newTree.readContent('selector.ts');

      expect(file).toBe(input);
    }));
    it(`does not rename other methods on namespace import`, waitForAsync(async () => {
      const input = `
        import * as routerStore from '@ngrx/router-store';
        const root = routerStore.forRoot();
      `;

      appTree.create('./selector.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner
        .runSchematicAsync(`ngrx-${pkgName}-migration-05`, {}, appTree)
        .toPromise();
      const file = newTree.readContent('selector.ts');

      expect(file).toBe(input);
    }));
  });
});
