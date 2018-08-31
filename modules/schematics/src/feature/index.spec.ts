import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as FeatureOptions } from './schema';
import {} from '../../schematics-core';
import {
  getTestProjectPath,
  createWorkspace,
} from '../../../schematics-core/testing';

describe('Feature Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: FeatureOptions = {
    name: 'foo',
    project: 'bar',
    // path: 'app',
    module: '',
    spec: true,
    group: false,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
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
  });

  it('should respect the path provided for the feature name', () => {
    const options = {
      ...defaultOptions,
      name: 'foo/Foo',
      group: true,
      module: 'app',
    };

    const tree = schematicRunner.runSchematic('feature', options, appTree);
    const effectsFileContent = tree.readContent(
      `${projectPath}/src/app/foo/effects/foo.effects.ts`
    );
    const reducerFileContent = tree.readContent(
      `${projectPath}/src/app/foo/reducers/foo.reducer.ts`
    );
    const moduleFileContent = tree.readContent(
      `${projectPath}/src/app/app.module.ts`
    );

    expect(moduleFileContent).toMatch(
      /import { FooEffects } from '\.\/foo\/effects\/foo.effects';/
    );
    expect(moduleFileContent).toMatch(
      /import \* as fromFoo from '\.\/foo\/reducers\/foo.reducer';/
    );
  });
});
