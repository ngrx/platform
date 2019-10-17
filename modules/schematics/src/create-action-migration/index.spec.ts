import { tags } from '@angular-devkit/core';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createWorkspace } from '../../../schematics-core/testing';

describe('Creator migration', async () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should use createAction to transform class action', async () => {
    const input = tags.stripIndent`
      export const SEARCH = '[Book] Search';
      export const SEARCH_COMPLETE =  '[Book] Search Complete';

      export class SearchAction implements Action {
        readonly type = SEARCH;
      
        constructor(public payload: string) { }
      }

      export class SearchCompleteAction implements Action {
        readonly type = SEARCH_COMPLETE;
      
        constructor(public payload: {blah: Book}) { }
      }
    `;

    const output = tags.stripIndent`
      export const search = createAction(
        '[Book] Search',
        props<{ payload: string }>()
      );

      export const searchComplete = createAction(
        '[Book] Search Complete',
        props<{ payload: Book[] }>()
      );

    `;

    await runTest(input, output);
  });

  async function runTest(input: string, expected: string) {
    const options = {};
    const effectPath = '/some.effects.ts';
    appTree.create(effectPath, input);

    const tree = await schematicRunner
      .runSchematicAsync('create-action-migration', options, appTree)
      .toPromise();

    const actual = tree.readContent(effectPath);

    // ** for indentation because empty lines are formatted on auto-save
    expect(actual).toBe(expected.replace(/\*\*/g, '  '));
  }
});
