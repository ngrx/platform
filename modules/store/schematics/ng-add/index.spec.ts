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
    skipPackageJson: false,
    project: 'bar',
    module: 'app',
  };

  const projectPath = getTestProjectPath();
  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
  });

  it('should update package.json', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);

    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/store']).toBeDefined();
  });

  it('should skip package.json update', () => {
    const options = { ...defaultOptions, skipPackageJson: true };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/store']).toBeUndefined();
  });

  it('should create the initial store setup', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/reducers/index.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should be provided by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { reducers, metaReducers } from '\.\/reducers';/
    );
    expect(content).toMatch(
      /StoreModule.forRoot\(reducers, { metaReducers }\)/
    );
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { reducers, metaReducers } from '\.\/reducers';/
    );
  });

  it('should import the environments correctly', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );
    expect(content).toMatch(
      /import { environment } from '..\/..\/environments\/environment';/
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
