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
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = createReducers(await createWorkspace(schematicRunner, appTree));
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
    };
    const tree = schematicRunner.runSchematic('reducer', options, appTree);

    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create a featureKey', () => {
    const tree = schematicRunner.runSchematic(
      'reducer',
      defaultOptions,
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatch(/fooFeatureKey = 'foo'/);
  });

  describe('View engine', () => {
    beforeEach(() => {
      const tsConfig = JSON.parse(
        appTree.readContent('./projects/bar/tsconfig.app.json')
      );
      tsConfig.angularCompilerOptions = tsConfig.angularCompilerOptions || {};
      tsConfig.angularCompilerOptions.enableIvy = false;
      appTree.overwrite(
        './projects/bar/tsconfig.app.json',
        JSON.stringify(tsConfig)
      );
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

    it('should create an reducer function using createReducer', () => {
      const tree = schematicRunner.runSchematic(
        'reducer',
        defaultOptions,
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.reducer.ts`
      );

      expect(fileContent).toMatch(
        /export function reducer\(state: State | undefined, action: Action\) {/
      );
      expect(fileContent).toMatch(/const fooReducer = createReducer\(/);
    });

    it('should create an reducer function in a feature using createReducer', () => {
      const tree = schematicRunner.runSchematic(
        'reducer',
        { ...defaultOptions, feature: true },
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.reducer.ts`
      );

      expect(fileContent).toMatch(
        /export function reducer\(state: State | undefined, action: Action\) {/
      );
      expect(fileContent).toMatch(/const fooReducer = createReducer\(/);
      expect(fileContent).toMatch(/on\(FooActions.loadFoos, state => state\)/);
    });

    it('should create an reducer function in an api feature using createReducer', () => {
      const tree = schematicRunner.runSchematic(
        'reducer',
        { ...defaultOptions, feature: true, api: true },
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.reducer.ts`
      );

      expect(fileContent).toMatch(
        /export function reducer\(state: State | undefined, action: Action\) {/
      );
      expect(fileContent).toMatch(/const fooReducer = createReducer\(/);
      expect(fileContent).toMatch(
        /on\(FooActions.loadFoosSuccess, \(state, action\) => state\)/
      );
      expect(fileContent).toMatch(
        /on\(FooActions.loadFoosFailure, \(state, action\) => state\)/
      );
    });
  });

  describe('Ivy', () => {
    it('should create and export a reducer', () => {
      const tree = schematicRunner.runSchematic(
        'reducer',
        defaultOptions,
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.reducer.ts`
      );

      expect(fileContent).toMatch(/export const reducer = createReducer\(/);
    });

    it('should create and export a reducer in a feature', () => {
      const tree = schematicRunner.runSchematic(
        'reducer',
        { ...defaultOptions, feature: true },
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.reducer.ts`
      );

      expect(fileContent).toMatch(/export const reducer = createReducer\(/);
      expect(fileContent).toMatch(/on\(FooActions.loadFoos, state => state\)/);
    });

    it('should create and export a reducer in an api feature', () => {
      const tree = schematicRunner.runSchematic(
        'reducer',
        { ...defaultOptions, feature: true, api: true },
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.reducer.ts`
      );

      expect(fileContent).toMatch(/export const reducer = createReducer\(/);
      expect(fileContent).toMatch(/on\(FooActions.loadFoos, state => state\)/);
      expect(fileContent).toMatch(
        /on\(FooActions.loadFoosSuccess, \(state, action\) => state\)/
      );
      expect(fileContent).toMatch(
        /on\(FooActions.loadFoosFailure, \(state, action\) => state\)/
      );
    });
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

    expect(reducers).toMatch(/\[fromFoo.fooFeatureKey\]\: fromFoo.State/);
  });

  it('should add the reducer function to the ActionReducerMap', () => {
    const options = { ...defaultOptions, reducers: 'reducers/index.ts' };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const reducers = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );

    expect(reducers).toMatch(/\[fromFoo.fooFeatureKey\]\: fromFoo.reducer/);
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
      skipTests: true,
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
      /import \* as FooActions from '..\/..\/actions\/foo\/foo.actions';/
    );
  });

  it('should create an reducer function with api success and failure, given creators=false, feature and api', () => {
    const tree = schematicRunner.runSchematic(
      'reducer',
      {
        ...defaultOptions,
        feature: true,
        api: true,
        creators: false,
      },
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatch(/case FooActionTypes\.LoadFoosSuccess/);
    expect(fileContent).toMatch(/case FooActionTypes\.LoadFoosFailure/);
    expect(fileContent).not.toMatch(/import { Action } from '@ngrx\/store'/);
  });
});
