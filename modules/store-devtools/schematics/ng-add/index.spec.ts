import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test';
import * as path from 'path';
import { Schema as StoreDevtoolsOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
} from '../../../schematics-core/testing';

describe('Store-Devtools ng-add Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/store-devtools',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: StoreDevtoolsOptions = {
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

    expect(packageJson.dependencies['@ngrx/store-devtools']).toBeDefined();
  });

  it('should skip package.json update', () => {
    const options = { ...defaultOptions, skipPackageJson: true };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/store-devtools']).toBeUndefined();
  });

  it('should be provided by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { StoreDevtoolsModule } from '@ngrx\/store-devtools';/
    );
    expect(content).toMatch(
      /StoreDevtoolsModule.instrument\({ maxAge: 25, logOnly: environment.production }\)/
    );
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { StoreDevtoolsModule } from '@ngrx\/store-devtools';/
    );
  });

  it('should import the environments correctly', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { environment } from '..\/environments\/environment';/
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

  it('should fail if negative maxAges', () => {
    const options = { ...defaultOptions, maxAge: -4 };

    let thrownError: Error | null = null;
    try {
      schematicRunner.runSchematic('ng-add', options, appTree);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should fail if maxAge of 1', () => {
    const options = { ...defaultOptions, maxAge: -4 };

    let thrownError: Error | null = null;
    try {
      schematicRunner.runSchematic('ng-add', options, appTree);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should support a custom maxAge', () => {
    const options = {
      ...defaultOptions,
      name: 'State',
      maxAge: 5,
    };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(/maxAge: 5/);
  });
});
