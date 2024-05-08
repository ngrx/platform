import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createWorkspace } from '@ngrx/schematics-core/testing';
import { tags } from '@angular-devkit/core';
import * as path from 'path';

describe('Effects Migration to 18.0.0-beta', () => {
  const collectionPath = path.join(__dirname, '../migration.json');
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  const verifySchematic = async (input: string, output: string) => {
    appTree.create('main.ts', input);

    const tree = await schematicRunner.runSchematic(
      `ngrx-effects-migration-18-beta`,
      {},
      appTree
    );

    const actual = tree.readContent('main.ts');

    expect(actual).toBe(output);
  };

  describe('replacements', () => {
    it('should replace the import', async () => {
      const input = tags.stripIndent`
import { concatLatestFrom } from '@ngrx/effects';

@Injectable()
export class SomeEffects {

}
      `;
      const output = tags.stripIndent`
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class SomeEffects {

}
      `;

      await verifySchematic(input, output);
    });

    it('should also work with " in imports', async () => {
      const input = tags.stripIndent`
import { concatLatestFrom } from "@ngrx/effects";

@Injectable()
export class SomeEffects {

}
      `;
      const output = tags.stripIndent`
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class SomeEffects {

}
      `;
      await verifySchematic(input, output);
    });

    it('should replace if multiple imports are inside an import statement', async () => {
      const input = tags.stripIndent`
import { Actions, concatLatestFrom } from '@ngrx/effects';

@Injectable()
export class SomeEffects {
  actions$ = inject(Actions);

}
      `;
      const output = tags.stripIndent`
import { Actions } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class SomeEffects {
  actions$ = inject(Actions);

}
      `;

      await verifySchematic(input, output);
    });

    it('should add concatLatestFrom to existing import', async () => {
      const input = tags.stripIndent`
import { Actions, concatLatestFrom } from '@ngrx/effects';
import { tapResponse } from '@ngrx/operators';

@Injectable()
export class SomeEffects {
  actions$ = inject(Actions);

}
      `;
      const output = tags.stripIndent`
import { Actions } from '@ngrx/effects';
import { tapResponse, concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class SomeEffects {
  actions$ = inject(Actions);

}
      `;
      await verifySchematic(input, output);
    });
  });

  it('should add if they are missing', async () => {
    const originalPackageJson = JSON.parse(
      appTree.readContent('/package.json')
    );
    expect(originalPackageJson.dependencies['@ngrx/operators']).toBeUndefined();
    expect(
      originalPackageJson.devDependencies['@ngrx/operators']
    ).toBeUndefined();

    const tree = await schematicRunner.runSchematic(
      `ngrx-effects-migration-18-beta`,
      {},
      appTree
    );

    const packageJson = JSON.parse(tree.readContent('/package.json'));
    expect(packageJson.dependencies['@ngrx/operators']).toBeDefined();
  });
});
