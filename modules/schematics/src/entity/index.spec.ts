import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as EntityOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
  defaultWorkspaceOptions,
  defaultAppOptions,
} from '@ngrx/schematics-core/testing';

describe('Entity Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: EntityOptions = {
    name: 'foo',
    project: 'bar',
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create 3 files', async () => {
    const tree = await schematicRunner.runSchematic(
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

    expect(
      tree.readContent(`${projectPath}/src/app/foo.actions.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/app/foo.model.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/app/foo.reducer.ts`)
    ).toMatchSnapshot();
  });

  it('should create 3 files of an entity to specified project if provided', async () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = await schematicRunner.runSchematic('entity', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);

    expect(
      tree.readContent(`${projectPath}/src/lib/foo.actions.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/lib/foo.model.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/lib/foo.reducer.ts`)
    ).toMatchSnapshot();
  });

  it('should create a folder if flat is false', async () => {
    const tree = await schematicRunner.runSchematic(
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

  it('should create 4 files if spec is true', async () => {
    const options = {
      ...defaultOptions,
    };
    const tree = await schematicRunner.runSchematic('entity', options, appTree);

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

  it('should import into a specified module', async () => {
    const options = { ...defaultOptions, module: 'app-module.ts' };

    const tree = await schematicRunner.runSchematic('entity', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app-module.ts`);

    expect(content).toMatchSnapshot();
  });
  it('should create all files of an entity within grouped and nested folders', async () => {
    const options = { ...defaultOptions, flat: false, group: true };

    const tree = await schematicRunner.runSchematic('entity', options, appTree);
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

    expect(
      tree.readContent(`${projectPath}/src/app/foo/actions/foo.actions.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/app/foo/models/foo.model.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/app/foo/reducers/foo.reducer.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(
        `${projectPath}/src/app/foo/reducers/foo.reducer.spec.ts`
      )
    ).toMatchSnapshot();
  });

  it('should create all files of an entity within grouped folders if group is set', async () => {
    const options = { ...defaultOptions, group: true };

    const tree = await schematicRunner.runSchematic('entity', options, appTree);
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

    expect(
      tree.readContent(`${projectPath}/src/app/actions/foo.actions.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/app/models/foo.model.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/app/reducers/foo.reducer.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/app/reducers/foo.reducer.spec.ts`)
    ).toMatchSnapshot();
  });

  it('should update the state to plural', async () => {
    const options = {
      ...defaultOptions,
      name: 'user',
      reducers: 'reducers/index.ts',
    };

    const _reducerTree = await schematicRunner.runSchematic(
      'store',
      options,
      appTree
    );
    const tree = await schematicRunner.runSchematic('entity', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/user.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/user.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/user.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/user.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);

    expect(
      tree.readContent(`${projectPath}/src/app/user.actions.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/app/user.model.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/app/user.reducer.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/app/user.reducer.spec.ts`)
    ).toMatchSnapshot();
    expect(
      tree.readContent(`${projectPath}/src/app/reducers/index.ts`)
    ).toMatchSnapshot();
  });
});
