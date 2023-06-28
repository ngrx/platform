import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ReducerOptions } from './schema';
import {
  getTestProjectPath,
  createReducers,
  createWorkspace,
  defaultWorkspaceOptions,
  defaultAppOptions,
} from '@ngrx/schematics-core/testing';

describe('Reducer Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: ReducerOptions = {
    name: 'foo',
    project: 'bar',
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = createReducers(await createWorkspace(schematicRunner, appTree));
  });

  it('should create one file', async () => {
    const tree = await schematicRunner.runSchematic(
      'reducer',
      defaultOptions,
      appTree
    );

    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create a reducer to specified project if provided', async () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = await schematicRunner.runSchematic(
      'reducer',
      options,
      appTree
    );
    const files = tree.files;
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create two files if spec is true', async () => {
    const options = {
      ...defaultOptions,
    };
    const tree = await schematicRunner.runSchematic(
      'reducer',
      options,
      appTree
    );

    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create a reducer', async () => {
    const tree = await schematicRunner.runSchematic(
      'reducer',
      defaultOptions,
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatchSnapshot();
  });

  it('should create and export a reducer in a feature', async () => {
    const tree = await schematicRunner.runSchematic(
      'reducer',
      { ...defaultOptions, feature: true },
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );
    expect(fileContent).toMatchSnapshot();
  });

  it('should create and export a reducer in an api feature', async () => {
    const tree = await schematicRunner.runSchematic(
      'reducer',
      { ...defaultOptions, feature: true, api: true },
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatchSnapshot();
  });

  it('should import into a specified module', async () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = await schematicRunner.runSchematic(
      'reducer',
      options,
      appTree
    );
    const appModule = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(appModule).toMatchSnapshot();
  });

  it('should create a reducers barrel file', async () => {
    const options = { ...defaultOptions, reducers: `reducers/index.ts` };

    const tree = await schematicRunner.runSchematic(
      'reducer',
      options,
      appTree
    );
    const reducers = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );

    expect(reducers).toMatchSnapshot();
  });

  it('should group within a "reducers" folder if group is set', async () => {
    const tree = await schematicRunner.runSchematic(
      'reducer',
      {
        ...defaultOptions,
        group: true,
      },
      appTree
    );

    expect(
      tree.files.indexOf(`${projectPath}/src/app/reducers/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);

    expect(
      tree.readContent(`${projectPath}/src/app/reducers/foo.reducer.ts`)
    ).toMatchSnapshot();
  });

  it('should group and nest the reducer within a feature', async () => {
    const options = {
      ...defaultOptions,
      skipTests: true,
      group: true,
      flat: false,
      feature: true,
    };

    const tree = await schematicRunner.runSchematic(
      'reducer',
      options,
      appTree
    );
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/reducers/foo/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);

    const content = tree.readContent(
      `${projectPath}/src/app/reducers/foo/foo.reducer.ts`
    );

    expect(content).toMatchSnapshot();
  });

  it('should create a reducer with prefix in an api feature', async () => {
    const tree = await schematicRunner.runSchematic(
      'reducer',
      { ...defaultOptions, feature: true, api: true, prefix: 'custom' },
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatchSnapshot();
  });
});
