import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createWorkspace } from '@ngrx/schematics-core/testing';

describe('ng-add Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );

  const defaultWorkspace = {
    version: 1,
    projects: {},
  };

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should add @ngrx/schematics into schematicCollections ', async () => {
    appTree.overwrite(
      '/angular.json',
      JSON.stringify(
        {
          ...defaultWorkspace,
          cli: { schematicCollections: ['existingCollection'] },
        },
        undefined,
        2
      )
    );

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', {}, appTree)
      .toPromise();
    const workspace = JSON.parse(tree.readContent('/angular.json'));
    expect(workspace.cli.schematicCollections).toEqual([
      'existingCollection',
      '@ngrx/schematics',
    ]);
  });

  it('should create schematicCollections is not defined', async () => {
    appTree.overwrite(
      '/angular.json',
      JSON.stringify(defaultWorkspace, undefined, 2)
    );

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', {}, appTree)
      .toPromise();
    const workspace = JSON.parse(tree.readContent('/angular.json'));
    expect(workspace.cli.schematicCollections).toEqual(['@ngrx/schematics']);
  });

  it('should create schematicCollections is not defined using the original defaultCollection ', async () => {
    appTree.overwrite(
      '/angular.json',
      JSON.stringify(
        {
          ...defaultWorkspace,
          cli: { defaultCollection: 'existingCollection' },
        },
        undefined,
        2
      )
    );

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', {}, appTree)
      .toPromise();
    const workspace = JSON.parse(tree.readContent('/angular.json'));
    expect(workspace.cli.schematicCollections).toEqual([
      'existingCollection',
      '@ngrx/schematics',
    ]);
  });
});
