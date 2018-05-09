import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ActionOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
} from '../../../schematics-core/testing';

describe('Action Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: ActionOptions = {
    name: 'foo',
    // path: 'app',
    project: 'bar',
    spec: false,
    group: false,
    flat: true,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
  });

  it('should create one file', () => {
    const tree = schematicRunner.runSchematic(
      'action',
      defaultOptions,
      appTree
    );
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create two files if spec is true', () => {
    const options = {
      ...defaultOptions,
      spec: true,
    };
    const tree = schematicRunner.runSchematic('action', options, appTree);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create an enum named "Foo"', () => {
    const tree = schematicRunner.runSchematic(
      'action',
      defaultOptions,
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.actions.ts`
    );

    expect(fileContent).toMatch(/export enum FooActionTypes/);
  });

  it('should group within an "actions" folder if group is set', () => {
    const tree = schematicRunner.runSchematic(
      'action',
      {
        ...defaultOptions,
        group: true,
      },
      appTree
    );
    expect(
      tree.files.indexOf(`${projectPath}/src/app/actions/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
  });
});
