import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

describe('Store Migration 16_0_0-beta', () => {
  const collectionPath = path.join(__dirname, '../migration.json');

  it(`should replace getMockStore with createMockStore`, async () => {
    const input = `
    import { getMockStore } from '@ngrx/store';
    import { SomethingElse } from '@ngrx/store';
    import {getMockStore} from '@ngrx/store';
    import {foo, getMockStore, bar} from '@ngrx/store';
    
    const mockStore = getMockStore();

    it('just a test', () => {
      const s =getMockStore();
    })
`;

    const expected = `
    import {createMockStore } from '@ngrx/store';
    import { SomethingElse } from '@ngrx/store';
    import {createMockStore} from '@ngrx/store';
    import {foo,createMockStore, bar} from '@ngrx/store';
    
    const mockStore =createMockStore();

    it('just a test', () => {
      const s =createMockStore();
    })
`;
    const appTree = new UnitTestTree(Tree.empty());
    appTree.create('./fixture.ts', input);
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const newTree = await runner
      .runSchematicAsync(`ngrx-store-migration-16-0-0-beta`, {}, appTree)
      .toPromise();
    const file = newTree.readContent('fixture.ts');

    expect(file).toBe(expected);
  });
});
