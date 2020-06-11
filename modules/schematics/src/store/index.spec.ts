import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as StoreOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
  defaultWorkspaceOptions,
  defaultAppOptions,
} from '../../../schematics-core/testing';

describe('Store Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: StoreOptions = {
    name: 'foo',
    project: 'bar',
    module: undefined,
    flat: false,
    root: true,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create the initial store setup', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('store', options, appTree);

    const files = tree.files;

    expect(
      files.indexOf(`${projectPath}/src/app/reducers/index.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should skip the initial store setup files if the minimal flag is provided', async () => {
    const options = {
      ...defaultOptions,
      module: 'app.module.ts',
      minimal: true,
    };

    const tree = await schematicRunner
      .runSchematicAsync('store', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    const files = tree.files;

    expect(content).not.toMatch(
      /import { reducers, metaReducers } from '\.\/reducers';/
    );
    expect(content).toMatch(/StoreModule.forRoot\({}\),/);
    expect(files.indexOf(`${projectPath}/src/app/reducers/index.ts`)).toBe(-1);
  });

  it('should not skip the initial store setup files if the minimal flag is provided with a feature', async () => {
    const options = {
      ...defaultOptions,
      root: false,
      module: 'app.module.ts',
      minimal: true,
    };

    const tree = await schematicRunner
      .runSchematicAsync('store', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(
      /StoreModule\.forFeature\(fromFoo.fooFeatureKey, fromFoo\.reducers, { metaReducers: fromFoo.metaReducers }\)/
    );
    expect(
      tree.files.indexOf(`${projectPath}/src/app/reducers/index.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create the initial store to specified project if provided', () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const files = tree.files;

    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/reducers/index.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create the initial store to defaultProject if project is not provided', () => {
    const options = {
      ...defaultOptions,
      project: undefined,
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: defaultWorkspaceOptions.defaultProject,
    });

    const tree = schematicRunner.runSchematic('store', options, appTree);

    const files = tree.files;

    expect(
      files.indexOf(`${specifiedProjectPath}/src/app/reducers/index.ts`)
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
      /StoreModule\.forFeature\(fromFoo.fooFeatureKey, fromFoo\.reducers, { metaReducers: fromFoo.metaReducers }\)/
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

  it('should fail if a feature state name is not specified', () => {
    const options = {
      ...defaultOptions,
      name: undefined,
      root: false,
    };

    expect(() => {
      schematicRunner.runSchematic('store', options, appTree);
    }).toThrowError('Please provide a name for the feature state');
  });

  it('should pass if a root state name is not specified', () => {
    const options = {
      ...defaultOptions,
      name: undefined,
    };

    expect(() => {
      schematicRunner.runSchematic('store', options, appTree);
    }).not.toThrow();
  });

  it('should add a feature key if not root', () => {
    const options = { ...defaultOptions, root: false };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );
    expect(content).toMatch(/fooFeatureKey = 'foo'/);
  });

  it('should not add a feature key if root', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('store', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );
    expect(content).not.toMatch(/fooFeatureKey = 'foo'/);
  });

  it('should add the initial config correctly into an empty module', async () => {
    const options = {
      ...defaultOptions,
      module: 'empty.module.ts',
    };

    appTree.create(
      `${projectPath}/src/app/empty.module.ts`,
      `
        import { NgModule } from '@angular/core';

        @NgModule({
          declarations: [],
          imports: [],
        })
        export class EmptyModule {}
      `
    );

    const tree = await schematicRunner
      .runSchematicAsync('store', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/empty.module.ts`);

    expect(content).toMatch(
      /imports: \[StoreModule.forRoot\(reducers, { metaReducers }\), !environment.production \? StoreDevtoolsModule.instrument\(\) : \[\]\]/
    );
  });
});
