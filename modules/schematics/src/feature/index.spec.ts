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
    entity: false,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create all files of a feature', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic(
      'feature',
      options,
      appTree
    );
    const files = tree.files;
    expect(
      files.includes(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/foo.actions.spec.ts`)
    ).toBeFalsy();
    expect(
      files.includes(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/foo.reducer.spec.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/foo.effects.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/foo.effects.spec.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/foo.selectors.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/foo.selectors.spec.ts`)
    ).toBeTruthy();
    expect(files.includes(`${projectPath}/src/app/foo.model.ts`)).toBeFalsy();
  });

  it('should not create test files when skipTests is true', async () => {
    const options = { ...defaultOptions, skipTests: true };

    const tree = await schematicRunner.runSchematic(
      'feature',
      options,
      appTree
    );
    const files = tree.files;
    expect(
      files.includes(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/foo.actions.spec.ts`)
    ).toBeFalsy();
    expect(
      files.includes(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/foo.reducer.spec.ts`)
    ).toBeFalsy();
    expect(
      files.includes(`${projectPath}/src/app/foo.effects.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/foo.effects.spec.ts`)
    ).toBeFalsy();
    expect(
      files.includes(`${projectPath}/src/app/foo.selectors.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/foo.selectors.spec.ts`)
    ).toBeFalsy();
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

    const tree = await schematicRunner.runSchematic(
      'feature',
      options,
      appTree
    );
    const files = tree.files;
    expect(
      files.includes(`${specifiedProjectPath}/src/lib/foo.actions.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${specifiedProjectPath}/src/lib/foo.actions.spec.ts`)
    ).toBeFalsy();
    expect(
      files.includes(`${specifiedProjectPath}/src/lib/foo.reducer.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${specifiedProjectPath}/src/lib/foo.reducer.spec.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${specifiedProjectPath}/src/lib/foo.effects.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${specifiedProjectPath}/src/lib/foo.effects.spec.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${specifiedProjectPath}/src/lib/foo.selectors.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${specifiedProjectPath}/src/lib/foo.selectors.spec.ts`)
    ).toBeTruthy();
  });

  it('should create all files of a feature within grouped folders if group is set', async () => {
    const options = { ...defaultOptions, group: true };

    const tree = await schematicRunner.runSchematic(
      'feature',
      options,
      appTree
    );
    const files = tree.files;
    expect(
      files.includes(`${projectPath}/src/app/actions/foo.actions.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/reducers/foo.reducer.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/reducers/foo.reducer.spec.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/effects/foo.effects.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/effects/foo.effects.spec.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/selectors/foo.selectors.ts`)
    ).toBeTruthy();
    expect(
      files.includes(`${projectPath}/src/app/selectors/foo.selectors.spec.ts`)
    ).toBeTruthy();
  });

  it('should respect the path provided for the feature name', async () => {
    const options = {
      ...defaultOptions,
      name: 'foo/Foo',
      group: true,
      module: 'app',
    };

    const tree = await schematicRunner.runSchematic(
      'feature',
      options,
      appTree
    );
    const moduleFileContent = tree.readContent(
      `${projectPath}/src/app/app.module.ts`
    );

    expect(moduleFileContent).toMatchSnapshot();
  });

  it('should have all api effect if api flag enabled', async () => {
    const options = {
      ...defaultOptions,
      api: true,
    };

    const tree = await schematicRunner.runSchematic(
      'feature',
      options,
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.effects.ts`
    );

    expect(fileContent).toMatchSnapshot();
  });

  it('should have all api actions in reducer if api flag enabled', async () => {
    const options = {
      ...defaultOptions,
      api: true,
    };

    const tree = await schematicRunner.runSchematic(
      'feature',
      options,
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatchSnapshot();
  });

  it('should have all api effect with prefix if api flag enabled', async () => {
    const options = {
      ...defaultOptions,
      api: true,
      prefix: 'custom',
    };

    const tree = await schematicRunner.runSchematic(
      'feature',
      options,
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.effects.ts`
    );

    expect(fileContent).toMatchSnapshot();
  });

  it('should have all api actions with prefix in reducer if api flag enabled', async () => {
    const options = {
      ...defaultOptions,
      api: true,
      prefix: 'custom',
    };

    const tree = await schematicRunner.runSchematic(
      'feature',
      options,
      appTree
    );
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.reducer.ts`
    );

    expect(fileContent).toMatchSnapshot();
  });

  it('should create all files of a feature with an entity', async () => {
    const options = { ...defaultOptions, entity: true };

    const tree = await schematicRunner.runSchematic(
      'feature',
      options,
      appTree
    );
    const paths = [
      `${projectPath}/src/app/foo.actions.ts`,
      `${projectPath}/src/app/foo.reducer.ts`,
      `${projectPath}/src/app/foo.reducer.spec.ts`,
      `${projectPath}/src/app/foo.effects.ts`,
      `${projectPath}/src/app/foo.effects.spec.ts`,
      `${projectPath}/src/app/foo.model.ts`,
    ];

    paths.forEach((path) => {
      expect(tree.files.includes(path)).toBeTruthy();
      expect(tree.readContent(path)).toMatchSnapshot();
    });
  });
});
