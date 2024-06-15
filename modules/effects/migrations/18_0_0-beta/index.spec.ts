import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createWorkspace } from '@ngrx/schematics-core/testing';
import { tags } from '@angular-devkit/core';
import * as path from 'path';
import { LogEntry } from '@angular-devkit/core/src/logger';

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

  it('should work with prior import from same namespace', async () => {
    const input = tags.stripIndent`
import { Actions } from '@ngrx/effects';
import { concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

class SomeEffects {}
      `;
    const output = tags.stripIndent`
import { Actions } from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

class SomeEffects {}
      `;
    await verifySchematic(input, output);
  });

  it('should operate on multiple files', async () => {
    const inputMainOne = tags.stripIndent`
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

class SomeEffects {}
`;

    const outputMainOne = tags.stripIndent`
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { tap } from 'rxjs/operators';

class SomeEffects {}
`;

    const inputMainTwo = tags.stripIndent`
import { provideEffects } from '@ngrx/effects';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

class SomeEffects {}
`;

    const outputMainTwo = tags.stripIndent`
import { provideEffects } from '@ngrx/effects';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

class SomeEffects {}
`;
    appTree.create('mainOne.ts', inputMainOne);
    appTree.create('mainTwo.ts', inputMainTwo);

    const tree = await schematicRunner.runSchematic(
      `ngrx-effects-migration-18-beta`,
      {},
      appTree
    );

    const actualMainOne = tree.readContent('mainOne.ts');
    const actualMainTwo = tree.readContent('mainTwo.ts');

    expect(actualMainOne).toBe(outputMainOne);
    expect(actualMainTwo).toBe(outputMainTwo);
  });

  it('should report a warning on multiple imports of concatLatestFrom', async () => {
    const input = tags.stripIndent`
import { concatLatestFrom } from '@ngrx/effects';
import { concatLatestFrom, createEffect, ofType } from '@ngrx/effects';

class SomeEffects {}
      `;

    appTree.create('main.ts', input);
    const logEntries: LogEntry[] = [];
    schematicRunner.logger.subscribe((logEntry) => logEntries.push(logEntry));
    await schematicRunner.runSchematic(
      `ngrx-effects-migration-18-beta`,
      {},
      appTree
    );

    expect(logEntries).toHaveLength(1);
    expect(logEntries[0]).toMatchObject({
      message:
        '[@ngrx/effects] Skipping because of multiple `concatLatestFrom` imports',
      level: 'warn',
    });
  });

  it('should add @ngrx/operators if they are missing', async () => {
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
