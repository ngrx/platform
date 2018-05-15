import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test';
import * as path from 'path';
import { Schema as RootStoreOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
} from '../../../schematics-core/testing';

describe('Store ng-add Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/store',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: RootStoreOptions = {
    name: 'foo',
    skipPackageJson: false,
    project: 'bar',
    module: undefined,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
  });

  it('should update package.json', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));

    expect(packageJson.dependencies['@ngrx/store']).toBeDefined();
  });

  it('should create the initial store setup', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/reducers/index.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should not be provided by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).not.toMatch(
      /import { reducers, metaReducers } from '\.\/reducers';/
    );
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { reducers, metaReducers } from '\.\/reducers';/
    );
  });

  it('should fail if specified module does not exist', () => {
    const options = { ...defaultOptions, module: '/src/app/app.moduleXXX.ts' };
    let thrownError: Error | null = null;
    try {
      schematicRunner.runSchematic('ng-add', options, appTree);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should support a default root state interface name', () => {
    const options = { ...defaultOptions, name: 'State' };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
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

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );
    expect(content).toMatch(/export interface AppState {/);
  });
});
