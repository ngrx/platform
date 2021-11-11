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
    const tree = await schematicRunner
      .runSchematicAsync('reducer', defaultOptions, appTree)
      .toPromise();

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

    const tree = await schematicRunner
      .runSchematicAsync('reducer', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create two files if spec is true', async () => {
    const options = {
      ...defaultOptions,
    };
    const tree = await schematicRunner
      .runSchematicAsync('reducer', options, appTree)
      .toPromise();

    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create a featureKey', async () => {
    const tree = await schematicRunner
      .runSchematicAsync('reducer', defaultOptions, appTree)
      .toPromise();
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatch(/fooFeatureKey = 'foo'/);
  });

  describe('Ivy', () => {
    it('should create and export a reducer', async () => {
      const tree = await schematicRunner
        .runSchematicAsync('reducer', defaultOptions, appTree)
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.reducer.ts`
      );

      expect(fileContent).toMatch(/export const reducer = createReducer\(/);
    });

    it('should create and export a reducer in a feature', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'reducer',
          { ...defaultOptions, feature: true },
          appTree
        )
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.reducer.ts`
      );

      expect(fileContent).toMatch(/export const reducer = createReducer\(/);
      expect(fileContent).toMatch(/on\(FooActions.loadFoos, state => state\)/);
    });

    it('should create and export a reducer in an api feature', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'reducer',
          { ...defaultOptions, feature: true, api: true },
          appTree
        )
        .toPromise();
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

  it('should import into a specified module', async () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = await schematicRunner
      .runSchematicAsync('reducer', options, appTree)
      .toPromise();
    const appModule = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(appModule).toMatch(/import \* as fromFoo from '.\/foo.reducer'/);
  });

  it('should import into a specified reducers file', async () => {
    const options = { ...defaultOptions, reducers: `reducers/index.ts` };

    const tree = await schematicRunner
      .runSchematicAsync('reducer', options, appTree)
      .toPromise();
    const reducers = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );

    expect(reducers).toMatch(/import \* as fromFoo from '..\/foo.reducer'/);
  });

  it('should add the reducer State to the State interface', async () => {
    const options = { ...defaultOptions, reducers: 'reducers/index.ts' };

    const tree = await schematicRunner
      .runSchematicAsync('reducer', options, appTree)
      .toPromise();
    const reducers = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );

    expect(reducers).toMatch(/\[fromFoo.fooFeatureKey\]: fromFoo.State/);
  });

  it('should add the reducer function to the ActionReducerMap', async () => {
    const options = { ...defaultOptions, reducers: 'reducers/index.ts' };

    const tree = await schematicRunner
      .runSchematicAsync('reducer', options, appTree)
      .toPromise();
    const reducers = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );

    expect(reducers).toMatch(/\[fromFoo.fooFeatureKey\]: fromFoo.reducer/);
  });

  it('should group within a "reducers" folder if group is set', async () => {
    const tree = await schematicRunner
      .runSchematicAsync(
        'reducer',
        {
          ...defaultOptions,
          group: true,
        },
        appTree
      )
      .toPromise();

    expect(
      tree.files.indexOf(`${projectPath}/src/app/reducers/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should group and nest the reducer within a feature', async () => {
    const options = {
      ...defaultOptions,
      skipTests: true,
      group: true,
      flat: false,
      feature: true,
    };

    const tree = await schematicRunner
      .runSchematicAsync('reducer', options, appTree)
      .toPromise();
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

  it('should create an reducer function with api success and failure, given creators=false, feature and api', async () => {
    const tree = await schematicRunner
      .runSchematicAsync(
        'reducer',
        {
          ...defaultOptions,
          feature: true,
          api: true,
          creators: false,
        },
        appTree
      )
      .toPromise();
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatch(/case FooActionTypes\.LoadFoosSuccess/);
    expect(fileContent).toMatch(/case FooActionTypes\.LoadFoosFailure/);
    expect(fileContent).not.toMatch(/import { Action } from '@ngrx\/store'/);
  });

  it('should create a reducer with prefix in an api feature', async () => {
    const tree = await schematicRunner
      .runSchematicAsync(
        'reducer',
        { ...defaultOptions, feature: true, api: true, prefix: 'custom' },
        appTree
      )
      .toPromise();
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatch(/on\(FooActions.customFoos, state => state\)/);
    expect(fileContent).toMatch(
      /on\(FooActions.customFoosSuccess, \(state, action\) => state\)/
    );
    expect(fileContent).toMatch(
      /on\(FooActions.customFoosFailure, \(state, action\) => state\)/
    );
  });
});
