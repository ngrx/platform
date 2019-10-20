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

  it('should remove both consts and classes and replace by createAction, remove Action and import createAction and props', async () => {
    const input = tags.stripIndent`
      import { Action } from '@ngrx/store';

      export const SEARCH = '[Book] Search';
      export const SEARCH_COMPLETE =  '[Book] Search Complete';

      export class SearchAction implements Action {
        readonly type = SEARCH;

        constructor(public payload: string) { }
      }

      export class SearchCompleteAction implements Action {
        readonly type = SEARCH_COMPLETE;

        constructor(public payload: Book[]) { }
      }
    `;

    const output = tags.stripIndent`
      import { createAction, props } from '@ngrx/store';

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

  it('should only one const and class and replace by createAction, other class is not Action', async () => {
    const input = tags.stripIndent`
      import { Action } from '@ngrx/store';

      export const SEARCH = '[Book] Search';
      export const SEARCH_COMPLETE =  '[Book] Search Complete';

      export class SearchAction implements Action {
        readonly type = SEARCH;

        constructor(public payload: string) { }
      }

      export class SearchCompleteAction {
        readonly type = SEARCH_COMPLETE;

        constructor(public payload: Book[]) { }
      }
    `;

    const output = tags.stripIndent`
      import { createAction, props } from '@ngrx/store';

      export const search = createAction(
        '[Book] Search',
        props<{ payload: string }>()
      );

      export const SEARCH_COMPLETE =  '[Book] Search Complete';



      export class SearchCompleteAction {
        readonly type = SEARCH_COMPLETE;

        constructor(public payload: Book[]) { }
      }
    `;

    await runTest(input, output);
  });

  it('should only import createAction, no props', async () => {
    const input = tags.stripIndent`
      import { Action } from '@ngrx/store';

      export const SEARCH = '[Book] Search';
      export const SEARCH_COMPLETE =  '[Book] Search Complete';

      export class SearchAction implements Action {
        readonly type = SEARCH;
      }

      export class SearchCompleteAction implements Action {
        readonly type = SEARCH_COMPLETE;
      }
    `;

    const output = tags.stripIndent`
      import { createAction } from '@ngrx/store';

      export const search = createAction(
        '[Book] Search'
      );

      export const searchComplete = createAction(
        '[Book] Search Complete'
      );
    `;

    await runTest(input, output);
  });

  it('should correctly compose props type from constructor payload type', async () => {
    const input = tags.stripIndent`
      import { Action } from '@ngrx/store';
      import { Error } from './some-error-lib';

      export const SEARCH = '[Book] Search';
      export const SEARCH_COMPLETE =  '[Book] Search Complete';
      export const SEARCH_FAILURE =  '[Book] Search Failure';


      export class SearchAction implements Action {
        readonly type = SEARCH;

        constructor(public payload: string) { }
      }

      export class SearchCompleteAction implements Action {
        readonly type = SEARCH_COMPLETE;

        constructor(public payload: Book[]) { }
      }

      export class SearchFailureAction implements Action {
        readonly type = SEARCH_FAILURE;

        constructor(public payload: {error: Error}) { }
      }
    `;

    const output = tags.stripIndent`
      import { createAction, props } from '@ngrx/store';
      import { Error } from './some-error-lib';

      export const search = createAction(
        '[Book] Search',
        props<{ payload: string }>()
      );

      export const searchComplete = createAction(
        '[Book] Search Complete',
        props<{ payload: Book[] }>()
      );

      export const searchFailure = createAction(
        '[Book] Search Failure',
        props<{ payload: {error: Error} }>()
      );
    `;

    await runTest(input, output);
  });

  it('should not do anythings since it is not ngrx Action', async () => {
    const input = tags.stripIndent`
      import { Action } from 'some-other-lib';

      export const SEARCH = '[Book] Search';
      export const SEARCH_COMPLETE =  '[Book] Search Complete';

      export class SearchAction implements Action {
        readonly type = SEARCH;

        constructor(public payload: string) { }
      }

      export class SearchCompleteAction implements Action {
        readonly type = SEARCH_COMPLETE;

        constructor(public payload: Book[]) { }
      }
    `;

    await runTest(input, input);
  });

  async function runTest(input: string, expected: string) {
    const options = {};
    const effectPath = '/some.effects.ts';
    appTree.create(effectPath, input);

    const tree = await schematicRunner
      .runSchematicAsync('create-action-migration', options, appTree)
      .toPromise();

    let actual = tree.readContent(effectPath);

    // ** for indentation because empty lines are formatted on auto-save
    actual = actual.trim();
    expect(actual).toBe(expected);
  }
});
