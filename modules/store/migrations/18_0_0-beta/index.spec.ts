import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createWorkspace } from '@ngrx/schematics-core/testing';
import * as path from 'path';
import { tags } from '@angular-devkit/core';

describe('Store Migration to 18.0.0-beta', () => {
  const collectionPath = path.join(__dirname, '../migration.json');
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  const verifySchematic = async (input: string, output: string) => {
    appTree.create('main.ts', input);
    appTree.create(
      'other.ts',
      `const action: TypedAction<'[SOURCE] Event'> = { type: '[SOURCE] Event' };`
    );

    const tree = await schematicRunner.runSchematic(
      `ngrx-store-migration-18-beta`,
      {},
      appTree
    );

    const actual = tree.readContent('main.ts');
    expect(actual).toBe(output);

    const other = tree.readContent('other.ts');
    expect(other).toBe(
      `const action: TypedAction<'[SOURCE] Event'> = { type: '[SOURCE] Event' };`
    );
  };

  describe('replacements', () => {
    it('should replace the import', async () => {
      const input = tags.stripIndent`
import { TypedAction } from '@ngrx/store/src/models';

const action: TypedAction<'[SOURCE] Event'> = { type: '[SOURCE] Event' };

export type ActionCreatorWithOptionalProps<T> = T extends undefined
  ? ActionCreator<string, () => TypedAction<string>>
  : ActionCreator<
      string,
      (props: T & NotAllowedCheck<T & object>) => T & TypedAction<string>
    >;

class Fixture {
  errorHandler(input?: (payload?: any) => TypedAction<any>): Action | never {}
}`;
      const output = tags.stripIndent`
import { Action } from '@ngrx/store';

const action: Action<'[SOURCE] Event'> = { type: '[SOURCE] Event' };

export type ActionCreatorWithOptionalProps<T> = T extends undefined
  ? ActionCreator<string, () => Action<string>>
  : ActionCreator<
      string,
      (props: T & NotAllowedCheck<T & object>) => T & Action<string>
    >;

class Fixture {
  errorHandler(input?: (payload?: any) => Action<any>): Action | never {}
}`;

      await verifySchematic(input, output);
    });

    it('should also work with " in imports', async () => {
      const input = tags.stripIndent`
import { TypedAction } from "@ngrx/store/src/models";
const action: TypedAction<'[SOURCE] Event'> = { type: '[SOURCE] Event' };
`;
      const output = tags.stripIndent`
import { Action } from '@ngrx/store';
const action: Action<'[SOURCE] Event'> = { type: '[SOURCE] Event' };
`;
      await verifySchematic(input, output);
    });

    it('should replace if multiple imports are inside an import statement', async () => {
      const input = tags.stripIndent`
import { TypedAction, ActionReducer } from '@ngrx/store/src/models';

const action: TypedAction<'[SOURCE] Event'> = { type: '[SOURCE] Event' };
      `;
      const output = tags.stripIndent`
import { ActionReducer } from '@ngrx/store/src/models';
import { Action } from '@ngrx/store';

const action: Action<'[SOURCE] Event'> = { type: '[SOURCE] Event' };
      `;

      await verifySchematic(input, output);
    });

    it('should add Action to existing import', async () => {
      const input = tags.stripIndent`
import { TypedAction } from '@ngrx/store/src/models';
import { createAction } from '@ngrx/store';

const action: TypedAction<'[SOURCE] Event'> = { type: '[SOURCE] Event' };
      `;
      const output = tags.stripIndent`
import { createAction, Action } from '@ngrx/store';

const action: Action<'[SOURCE] Event'> = { type: '[SOURCE] Event' };
      `;
      await verifySchematic(input, output);
    });

    it('should not add Action if already exists', async () => {
      const input = tags.stripIndent`
import { TypedAction } from '@ngrx/store/src/models';
import { Action } from '@ngrx/store';

const action: TypedAction<'[SOURCE] Event'> = { type: '[SOURCE] Event' };
      `;
      const output = tags.stripIndent`
import { Action } from '@ngrx/store';

const action: Action<'[SOURCE] Event'> = { type: '[SOURCE] Event' };
      `;
      await verifySchematic(input, output);
    });
  });
});
