import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as EntityOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
  defaultWorkspaceOptions,
  defaultAppOptions,
} from '../../../schematics-core/testing';

describe('Entity Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: EntityOptions = {
    name: 'foo',
    project: 'bar',
    spec: false,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create 3 files', () => {
    const tree = schematicRunner.runSchematic(
      'entity',
      defaultOptions,
      appTree
    );

    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create 3 files of an entity to specified project if provided', () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = schematicRunner.runSchematic('entity', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create a folder if flat is false', () => {
    const tree = schematicRunner.runSchematic(
      'entity',
      {
        ...defaultOptions,
        flat: false,
      },
      appTree
    );
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create 4 files if spec is true', () => {
    const options = {
      ...defaultOptions,
      spec: true,
    };
    const tree = schematicRunner.runSchematic('entity', options, appTree);

    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('entity', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/import \* as fromFoo from '\.\/foo.reducer';/);
  });

  it('should create all files of an entity within grouped and nested folders', () => {
    const options = { ...defaultOptions, flat: false, group: true, spec: true };

    const tree = schematicRunner.runSchematic('entity', options, appTree);
    const files = tree.files;

    expect(
      files.indexOf(`${projectPath}/src/app/foo/actions/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/models/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/reducers/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/reducers/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create all files of an entity within grouped folders if group is set', () => {
    const options = { ...defaultOptions, group: true, spec: true };

    const tree = schematicRunner.runSchematic('entity', options, appTree);
    const files = tree.files;

    expect(
      files.indexOf(`${projectPath}/src/app/actions/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/models/foo.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/reducers/foo.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/reducers/foo.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should update the state to plural', () => {
    const options = {
      ...defaultOptions,
      name: 'user',
      reducers: 'reducers/index.ts',
      spec: true,
    };

    const reducerTree = schematicRunner.runSchematic('store', options, appTree);
    const tree = schematicRunner.runSchematic('entity', options, appTree);
    const files = tree.files;
    const content = tree.readContent(
      `${projectPath}/src/app/reducers/index.ts`
    );
    expect(
      files.indexOf(`${projectPath}/src/app/user.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/user.model.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/user.reducer.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/user.reducer.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(content).toMatch(/users\: fromUser.State/);
    expect(content).toMatch(/users\: fromUser.reducer/);
  });

  describe('action creators', () => {
    const creatorOptions = { ...defaultOptions, creators: true };

    it('should create a const for the action creator', () => {
      const tree = schematicRunner.runSchematic(
        'entity',
        creatorOptions,
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );
      expect(fileContent).toMatch(/export const loadFoos = createAction\(/);
      expect(fileContent).toMatch(/\[Foo\/API\] Load Foos\'/);
      expect(fileContent).toMatch(/props\<\{ foos\: Foo\[\] }>\(\)/);
    });

    it('should use action creator types in the reducer', () => {
      const tree = schematicRunner.runSchematic(
        'entity',
        creatorOptions,
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.reducer.ts`
      );
      expect(fileContent).toMatch(
        /import \* as FooActions from \'\.\/foo.actions\';/
      );
      expect(fileContent).toMatch(/on\(FooActions.addFoo,/);
      expect(fileContent).toMatch(
        /\(state, action\) => adapter\.addOne\(action.foo, state\)/
      );
    });
  });
});
