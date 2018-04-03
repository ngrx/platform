import { Tree, VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createAppModule, getFileContent } from './utils';
import { StoreOptions } from '../src/store';

describe('Store Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: StoreOptions = {
    name: 'foo',
    path: 'app',
    sourceDir: 'src',
    spec: true,
    module: undefined,
    flat: false,
    root: true,
  };

  let appTree: Tree;

  beforeEach(() => {
    appTree = new VirtualTree();
    appTree = createAppModule(appTree);
  });

  it('should create the initial store setup', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const files = tree.files;
    expect(files.indexOf('/src/app/reducers/index.ts')).toBeGreaterThanOrEqual(
      0
    );
  });

  it('should not be provided by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = getFileContent(tree, '/src/app/app.module.ts');
    expect(content).not.toMatch(
      /import { reducers, metaReducers } from '\.\/reducers';/
    );
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = getFileContent(tree, '/src/app/app.module.ts');
    expect(content).toMatch(
      /import { reducers, metaReducers } from '\.\/reducers';/
    );
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
    const content = getFileContent(tree, '/src/app/app.module.ts');
    expect(content).toMatch(
      /StoreModule\.forFeature\('foo', fromFoo\.reducers, { metaReducers: fromFoo.metaReducers }\)/
    );
  });

  it('should use a wildcard for a feature import ', () => {
    const options = { ...defaultOptions, root: false, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = getFileContent(tree, '/src/app/app.module.ts');
    expect(content).toMatch(/import \* as fromFoo from '\.\/reducers';/);
  });

  it('should support a default root state interface name', () => {
    const options = { ...defaultOptions, name: 'State' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = getFileContent(tree, '/src/app/reducers/index.ts');
    expect(content).toMatch(/export interface State {/);
  });

  it('should support a custom root state interface name', () => {
    const options = {
      ...defaultOptions,
      name: 'State',
      stateInterface: 'AppState',
    };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = getFileContent(tree, '/src/app/reducers/index.ts');
    expect(content).toMatch(/export interface AppState {/);
  });

  it('should support a default feature state interface name', () => {
    const options = { ...defaultOptions, root: false, name: 'Feature' };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = getFileContent(tree, '/src/app/reducers/index.ts');
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
    const content = getFileContent(tree, '/src/app/reducers/index.ts');
    expect(content).toMatch(/export interface FeatureState {/);
  });
});
