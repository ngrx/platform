import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createWorkspace } from '@ngrx/schematics-core/testing';
import { tags } from '@angular-devkit/core';
import * as path from 'path';

describe('ComponentStore Migration to 18.0.0-beta', () => {
  const collectionPath = path.join(__dirname, '../migration.json');
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  const verifySchematic = async (input: string, output: string) => {
    appTree.create('main.ts', input);

    const tree = await schematicRunner.runSchematic(
      `ngrx-component-store-migration-18-beta`,
      {},
      appTree
    );

    const actual = tree.readContent('main.ts');

    expect(actual).toBe(output);
  };

  describe('replacements', () => {
    it('should replace the import', async () => {
      const input = tags.stripIndent`
import { tapResponse } from '@ngrx/component-store';

@Injectable()
export class MyStore extends ComponentStore {

}
      `;
      const output = tags.stripIndent`
import { tapResponse } from '@ngrx/operators';

@Injectable()
export class MyStore extends ComponentStore {

}
      `;

      await verifySchematic(input, output);
    });

    it('should also work with " in imports', async () => {
      const input = tags.stripIndent`
import { tapResponse } from "@ngrx/component-store";

@Injectable()
export class MyStore extends ComponentStore {

}
      `;
      const output = tags.stripIndent`
import { tapResponse } from '@ngrx/operators';

@Injectable()
export class MyStore extends ComponentStore {

}
      `;
      await verifySchematic(input, output);
    });

    it('should replace if multiple imports are inside an import statement', async () => {
      const input = tags.stripIndent`
import { ComponentStore, tapResponse } from '@ngrx/component-store';

@Injectable()
export class MyStore extends ComponentStore {

}
      `;
      const output = tags.stripIndent`
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';

@Injectable()
export class MyStore extends ComponentStore {

}
      `;

      await verifySchematic(input, output);
    });

    it('should add tapResponse to existing import', async () => {
      const input = tags.stripIndent`
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/operators';

@Injectable()
export class MyStore extends ComponentStore {

}
      `;
      const output = tags.stripIndent`
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';

@Injectable()
export class MyStore extends ComponentStore {

}
      `;
      await verifySchematic(input, output);
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
      `ngrx-component-store-migration-18-beta`,
      {},
      appTree
    );

    const packageJson = JSON.parse(tree.readContent('/package.json'));
    expect(packageJson.dependencies['@ngrx/operators']).toBeDefined();
  });
});
