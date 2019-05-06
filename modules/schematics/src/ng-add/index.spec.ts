import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createWorkspace } from '../../../schematics-core/testing';
import { Schema as SchematicOptions } from './schema';

describe('ng-add Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: SchematicOptions = {
    defaultCollection: true,
  };

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it(`should leave the workspace's cli as default`, () => {
    const options: SchematicOptions = {
      ...defaultOptions,
      defaultCollection: false,
    };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const workspace = JSON.parse(tree.readContent('/angular.json'));
    expect(workspace.cli).not.toBeDefined();
  });

  it('should set workspace default cli to @ngrx/schematics', () => {
    const options: SchematicOptions = {
      ...defaultOptions,
      defaultCollection: true,
    };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const workspace = JSON.parse(tree.readContent('/angular.json'));
    expect(workspace.cli.defaultCollection).toEqual('@ngrx/schematics');
  });
});
