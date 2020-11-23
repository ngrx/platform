import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema } from './schema';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { createWorkspace } from '../../../schematics-core/testing';

describe('selectors ng-add Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/selectors',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: Schema = {
    skipPackageJson: false,
  };

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should update package.json', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/selectors']).toBeDefined();
  });

  it('should skip package.json update', async () => {
    const options = { ...defaultOptions, skipPackageJson: true };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/selectors']).toBeUndefined();
  });
});
