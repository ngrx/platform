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
} from '../../../schematics-core/testing';

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

  it('should create all files of a feature', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('feature', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
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

  it('should create all files of a feature to specified project if provided', () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = schematicRunner.runSchematic('feature', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.actions.ts`)
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

  it('should create all files of a feature within grouped folders if group is set', () => {
    const options = { ...defaultOptions, group: true };

    const tree = schematicRunner.runSchematic('feature', options, appTree);
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

  it('should respect the path provided for the feature name', () => {
    const options = {
      ...defaultOptions,
      name: 'foo/Foo',
      group: true,
      module: 'app',
    };

    const tree = schematicRunner.runSchematic('feature', options, appTree);
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

  it('should have all three api actions in actions type union if api flag enabled and creators=false', () => {
    const options = {
      ...defaultOptions,
      api: true,
      creators: false,
    };

    const tree = schematicRunner.runSchematic('feature', options, appTree);
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.actions.ts`
    );

    expect(fileContent).toMatch(
      /export type FooActions = LoadFoos \| LoadFoosSuccess \| LoadFoosFailure/
    );
  });

  it('should have all api effect if api flag enabled', () => {
    const options = {
      ...defaultOptions,
      api: true,
    };

    const tree = schematicRunner.runSchematic('feature', options, appTree);
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.effects.ts`
    );

    expect(fileContent).toMatch(
      /import { Actions, createEffect, ofType } from '@ngrx\/effects';/
    );
    expect(fileContent).toMatch(
      /import { catchError, map, concatMap } from 'rxjs\/operators';/
    );
    expect(fileContent).toMatch(/import { EMPTY, of } from 'rxjs';/);
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

  it('should have all api actions in reducer if api flag enabled', () => {
    const options = {
      ...defaultOptions,
      api: true,
    };

    const tree = schematicRunner.runSchematic('feature', options, appTree);
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
});
