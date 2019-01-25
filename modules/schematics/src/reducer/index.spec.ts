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
} from '../../../schematics-core/testing';

describe('Reducer Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: ReducerOptions = {
    name: 'foo',
    project: 'bar',
    spec: false,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createReducers(createWorkspace(schematicRunner, appTree));
  });

  it('should create one file', () => {
    const tree = schematicRunner.runSchematic(
      'reducer',
      defaultOptions,
      appTree
    );

    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create a reducer to specified project if provided', () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create two files if spec is true', () => {
    const options = {
      ...defaultOptions,
      spec: true,
    };
    const tree = schematicRunner.runSchematic('reducer', options, appTree);

    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create an reducer function', () => {
    const tree = schematicRunner.runSchematic(
      'reducer',
      defaultOptions,
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatch(/export function reducer/);
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const appModule = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(appModule).toMatch(/import \* as fromFoo from '.\/foo.reducer'/);
  });

  it('should import into a specified reducers file', () => {
    const options = { ...defaultOptions, reducers: `reducers/index.ts` };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const reducers = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );

    expect(reducers).toMatch(/import \* as fromFoo from '..\/foo.reducer'/);
  });

  it('should add the reducer State to the State interface', () => {
    const options = { ...defaultOptions, reducers: 'reducers/index.ts' };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const reducers = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );

    expect(reducers).toMatch(/foo\: fromFoo.State/);
  });

  it('should add the reducer function to the ActionReducerMap', () => {
    const options = { ...defaultOptions, reducers: 'reducers/index.ts' };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const reducers = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );

    expect(reducers).toMatch(/foo\: fromFoo.reducer/);
  });

  it('should group within a "reducers" folder if group is set', () => {
    const tree = schematicRunner.runSchematic(
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
  });

  it('should group and nest the reducer within a feature', () => {
    const options = {
      ...defaultOptions,
      spec: false,
      group: true,
      flat: false,
      feature: true,
    };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/reducers/foo/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);

    const content = tree.readContent(
      `${projectPath}/src/app/reducers/foo/foo.reducer.ts`
    );

    expect(content).toMatch(
      /import\ \{\ FooActions,\ FooActionTypes\ }\ from\ \'\.\.\/\.\.\/actions\/foo\/foo\.actions';/
    );
  });
});
