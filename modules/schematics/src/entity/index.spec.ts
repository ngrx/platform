import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as EntityOptions } from './schema';
import {
  getProjectPath,
  createWorkspace,
} from '../utility/test/create-workspace';

describe('Entity Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: EntityOptions = {
    name: 'foo',
    project: 'bar',
    // path: 'app',
    spec: false,
  };

  const projectPath = getProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
  });

  it('should create 3 files', () => {
    const tree = schematicRunner.runSchematic(
      'entity',
      defaultOptions,
      appTree
    );

    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create a folder if flat is false', () => {
    const tree = schematicRunner.runSchematic(
      'entity',
      {
        ...defaultOptions,
        flat: false,
      },
      appTree
    );
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create 4 files if spec is true', () => {
    const options = {
      ...defaultOptions,
      spec: true,
    };
    const tree = schematicRunner.runSchematic('entity', options, appTree);

    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('entity', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/import \* as fromFoo from '\.\/foo.reducer';/);
  });

  it('should create all files of an entity within grouped and nested folders', () => {
    const options = { ...defaultOptions, flat: false, group: true, spec: true };

    const tree = schematicRunner.runSchematic('entity', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo/actions/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/models/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/reducers/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/reducers/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create all files of an entity within grouped folders if group is set', () => {
    const options = { ...defaultOptions, group: true, spec: true };

    const tree = schematicRunner.runSchematic('entity', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/actions/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/models/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/reducers/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/reducers/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
  });
});
