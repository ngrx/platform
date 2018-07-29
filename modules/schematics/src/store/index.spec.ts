import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as StoreOptions } from './schema';
import {} from '../../schematics-core';
import {
  getTestProjectPath,
  createWorkspace,
} from '../../../schematics-core/testing';
import { getProject } from '../../../schematics-core';

describe('Store Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: StoreOptions = {
    name: 'foo',
    project: 'bar',
    spec: true,
    module: undefined,
    flat: false,
    root: true,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
  });

  it('should create the initial store setup', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/reducers/index.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should not be provided by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).not.toMatch(
      /import { reducers, metaReducers } from '\.\/reducers';/
    );
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { reducers, metaReducers } from '\.\/reducers';/
    );
  });

  it('should import the environments correctly in the app module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { environment } from '..\/environments\/environment';/
    );
  });

  it('should import the environments correctly in the reducers', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );
    expect(content).toMatch(
      /import { environment } from '..\/..\/environments\/environment';/
    );
  });

  it('should not import the environments in the reducers for a library', () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
      module: 'baz.module.ts',
    };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(`/projects/baz/src/lib/reducers/index.ts`);
    expect(content).not.toMatch(/import { environment }/);
  });

  it('should fail if specified module does not exist', () => {
    const options = { ...defaultOptions, module: '/src/app/app.moduleXXX.ts' };
    let thrownError: Error | null = null;
    try {
      schematicRunner.runSchematic('store', options, appTree);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should import a feature a specified module', () => {
    const options = { ...defaultOptions, root: false, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /StoreModule\.forFeature\('foo', fromFoo\.reducers, { metaReducers: fromFoo.metaReducers }\)/
    );
  });

  it('should use a wildcard for a feature import ', () => {
    const options = { ...defaultOptions, root: false, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(/import \* as fromFoo from '\.\/reducers';/);
  });

  it('should support a default root state interface name', () => {
    const options = { ...defaultOptions, name: 'State' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );
    expect(content).toMatch(/export interface State {/);
  });

  it('should support a custom root state interface name', () => {
    const options = {
      ...defaultOptions,
      name: 'State',
      stateInterface: 'AppState',
    };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );
    expect(content).toMatch(/export interface AppState {/);
  });

  it('should support a default feature state interface name', () => {
    const options = { ...defaultOptions, root: false, name: 'Feature' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );
    expect(content).toMatch(/export interface State {/);
  });

  it('should support a custom feature state interface name', () => {
    const options = {
      ...defaultOptions,
      root: false,
      name: 'Feature',
      stateInterface: 'FeatureState',
    };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );
    expect(content).toMatch(/export interface FeatureState {/);
  });
});
