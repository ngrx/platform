import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

describe('Store Migration 15_2_0', () => {
  const collectionPath = path.join(__dirname, '../migration.json');
  const pkgName = 'store';

  it(`should replace remove the State type argument`, async () => {
    const input = `
    import {createFeature} from '@ngrx/store';
    interface AppState {
      users: State;
    }
    export const usersFeature = createFeature<AppState>({
      name: 'users',
      reducer: createReducer(initialState, /* case reducers */),
    });
`;

    const expected = `
    import {createFeature} from '@ngrx/store';
    interface AppState {
      users: State;
    }
    export const usersFeature = createFeature({
      name: 'users',
      reducer: createReducer(initialState, /* case reducers */),
    });
`;
    const appTree = new UnitTestTree(Tree.empty());
    appTree.create('./fixture.ts', input);
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const newTree = await runner
      .runSchematicAsync(`ngrx-${pkgName}-migration-15-2-0`, {}, appTree)
      .toPromise();
    const file = newTree.readContent('fixture.ts');

    expect(file).toBe(expected);
  });

  it(`should not update createFeature when correctly used`, async () => {
    const input = `
    import {createFeature} from '@ngrx/store';
    export const usersFeature = createFeature({
      name: 'users',
      reducer: createReducer(initialState, /* case reducers */),
    });
`;

    const appTree = new UnitTestTree(Tree.empty());
    appTree.create('./fixture.ts', input);
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const newTree = await runner
      .runSchematicAsync(`ngrx-${pkgName}-migration-15-2-0`, {}, appTree)
      .toPromise();
    const file = newTree.readContent('fixture.ts');

    expect(file).toBe(input);
  });
});
