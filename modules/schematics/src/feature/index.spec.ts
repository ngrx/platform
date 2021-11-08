import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as FeatureOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
  defaultWorkspaceOptions,
  defaultAppOptions,
} from '@ngrx/schematics-core/testing';

describe('Feature Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: FeatureOptions = {
    name: 'foo',
    project: 'bar',
    module: '',
    group: false,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create all files of a feature', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner
      .runSchematicAsync('feature', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo.actions.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo.effects.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo.selectors.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo.selectors.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should not create test files', async () => {
    const options = { ...defaultOptions, skipTests: true };

    const tree = await schematicRunner
      .runSchematicAsync('feature', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(files.indexOf(`${projectPath}/src/app/foo.actions.spec.ts`)).toEqual(
      -1
    );
    expect(
      files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(files.indexOf(`${projectPath}/src/app/foo.reducer.spec.ts`)).toEqual(
      -1
    );
    expect(
      files.indexOf(`${projectPath}/src/app/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(files.indexOf(`${projectPath}/src/app/foo.effects.spec.ts`)).toEqual(
      -1
    );
    expect(
      files.indexOf(`${projectPath}/src/app/foo.selectors.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo.selectors.spec.ts`)
    ).toEqual(-1);
  });

  it('should create all files of a feature to specified project if provided', async () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = await schematicRunner
      .runSchematicAsync('feature', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.actions.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.effects.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.selectors.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.selectors.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create all files of a feature within grouped folders if group is set', async () => {
    const options = { ...defaultOptions, group: true };

    const tree = await schematicRunner
      .runSchematicAsync('feature', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/actions/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/reducers/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/reducers/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/effects/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/effects/foo.effects.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/selectors/foo.selectors.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/selectors/foo.selectors.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should respect the path provided for the feature name', async () => {
    const options = {
      ...defaultOptions,
      name: 'foo/Foo',
      group: true,
      module: 'app',
    };

    const tree = await schematicRunner
      .runSchematicAsync('feature', options, appTree)
      .toPromise();
    const moduleFileContent = tree.readContent(
      `${projectPath}/src/app/app.module.ts`
    );

    expect(moduleFileContent).toMatch(
      /import { FooEffects } from '.\/foo\/effects\/foo.effects';/
    );
    expect(moduleFileContent).toMatch(
      /import \* as fromFoo from '.\/foo\/reducers\/foo.reducer';/
    );
  });

  it('should have all three api actions in actions type union if api flag enabled and creators=false', async () => {
    const options = {
      ...defaultOptions,
      api: true,
      creators: false,
    };

    const tree = await schematicRunner
      .runSchematicAsync('feature', options, appTree)
      .toPromise();
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.actions.ts`
    );

    expect(fileContent).toMatch(
      /export type FooActions = LoadFoos \| LoadFoosSuccess \| LoadFoosFailure/
    );
  });

  it('should have all api effect if api flag enabled', async () => {
    const options = {
      ...defaultOptions,
      api: true,
    };

    const tree = await schematicRunner
      .runSchematicAsync('feature', options, appTree)
      .toPromise();
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.effects.ts`
    );

    expect(fileContent).toMatch(
      /import { Actions, createEffect, ofType } from '@ngrx\/effects';/
    );
    expect(fileContent).toMatch(
      /import { catchError, map, concatMap } from 'rxjs\/operators';/
    );
    expect(fileContent).toMatch(
      /import { Observable, EMPTY, of } from 'rxjs';/
    );
    expect(fileContent).toMatch(
      /import \* as FooActions from '.\/foo.actions';/
    );

    expect(fileContent).toMatch(/export class FooEffects/);
    expect(fileContent).toMatch(/loadFoos\$ = createEffect\(\(\) => {/);
    expect(fileContent).toMatch(/return this.actions\$.pipe\(/);
    expect(fileContent).toMatch(/ofType\(FooActions.loadFoos\),/);
    expect(fileContent).toMatch(/concatMap\(\(\) =>/);
    expect(fileContent).toMatch(/EMPTY.pipe\(/);
    expect(fileContent).toMatch(
      /map\(data => FooActions.loadFoosSuccess\({ data }\)\),/
    );
    expect(fileContent).toMatch(
      /catchError\(error => of\(FooActions.loadFoosFailure\({ error }\)\)\)\)/
    );
  });

  it('should have all api actions in reducer if api flag enabled', async () => {
    const options = {
      ...defaultOptions,
      api: true,
    };

    const tree = await schematicRunner
      .runSchematicAsync('feature', options, appTree)
      .toPromise();
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatch(/on\(FooActions.loadFoos, state => state\),/);
    expect(fileContent).toMatch(
      /on\(FooActions.loadFoosSuccess, \(state, action\) => state\),/
    );
    expect(fileContent).toMatch(
      /on\(FooActions.loadFoosFailure, \(state, action\) => state\),/
    );
  });

  it('should have all api effect with prefix if api flag enabled', async () => {
    const options = {
      ...defaultOptions,
      api: true,
      prefix: 'custom',
    };

    const tree = await schematicRunner
      .runSchematicAsync('feature', options, appTree)
      .toPromise();
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.effects.ts`
    );

    expect(fileContent).toMatch(/customFoos\$ = createEffect\(\(\) => {/);
    expect(fileContent).toMatch(/ofType\(FooActions.customFoos\),/);

    expect(fileContent).toMatch(
      /map\(data => FooActions.customFoosSuccess\({ data }\)\),/
    );
    expect(fileContent).toMatch(
      /catchError\(error => of\(FooActions.customFoosFailure\({ error }\)\)\)\)/
    );
  });

  it('should have all api actions with prefix in reducer if api flag enabled', async () => {
    const options = {
      ...defaultOptions,
      api: true,
      prefix: 'custom',
    };

    const tree = await schematicRunner
      .runSchematicAsync('feature', options, appTree)
      .toPromise();
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatch(/on\(FooActions.customFoos, state => state\),/);
    expect(fileContent).toMatch(
      /on\(FooActions.customFoosSuccess, \(state, action\) => state\),/
    );
    expect(fileContent).toMatch(
      /on\(FooActions.customFoosFailure, \(state, action\) => state\),/
    );
  });
});
