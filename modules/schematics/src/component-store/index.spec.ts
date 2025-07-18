import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ComponentStoreOptions } from '../component-store/schema';
import {
  createWorkspace,
  defaultAppOptions,
  defaultWorkspaceOptions,
  getTestProjectPath,
} from '@ngrx/schematics-core/testing';

describe('component-store', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );

  const defaultOptions: ComponentStoreOptions = {
    name: 'foo',
    project: 'bar',
    module: undefined,
    flat: false,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create an component store to specified project if provided', async () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = await schematicRunner.runSchematic('cs', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo/foo.store.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo/foo.store.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create an component store with a spec file', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic(
      'component-store',
      options,
      appTree
    );
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.store.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.store.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should not be provided into the module by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic(
      'component-store',
      options,
      appTree
    );
    const content = tree.readContent(`${projectPath}/src/app/app-module.ts`);
    expect(content).not.toMatch(/FooStore/i);
    expect(content).toMatchSnapshot();
  });

  it('should import into a specified module when the module provided', async () => {
    const options = { ...defaultOptions, module: 'app-module.ts' };

    const tree = await schematicRunner.runSchematic(
      'component-store',
      options,
      appTree
    );
    const content = tree.readContent(`${projectPath}/src/app/app-module.ts`);

    expect(content).toMatch(/FooStore/i);
    expect(content).toMatchSnapshot();
  });

  it('should fail if specified module does not exist', async () => {
    const options = {
      ...defaultOptions,
      module: `${projectPath}/src/app/app-moduleXXX.ts`,
    };
    let thrownError: Error | null = null;
    try {
      await schematicRunner.runSchematic('component-store', options, appTree);
    } catch (err: any) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should respect the skipTests flag', async () => {
    const options = { ...defaultOptions, skipTests: true };

    const tree = await schematicRunner.runSchematic(
      'component-store',
      options,
      appTree
    );
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.store.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.store.spec.ts`)
    ).toEqual(-1);
  });

  it('should register the component store in the provided component', async () => {
    const options = { ...defaultOptions, component: 'app.ts' };

    const tree = await schematicRunner.runSchematic(
      'component-store',
      options,
      appTree
    );
    const content = tree.readContent(`${projectPath}/src/app/app.ts`);

    expect(content).toMatch(/FooStore/i);
    expect(content).toMatchSnapshot();
  });

  it('should fail if specified component does not exist', async () => {
    const options = {
      ...defaultOptions,
      component: `${projectPath}/src/app/appnotexist.ts`,
    };

    await expect(
      schematicRunner.runSchematic('component-store', options, appTree)
    ).rejects.toThrowError();
  });

  it('should inject the component store correctly into the spec', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner.runSchematic(
      'component-store',
      options,
      appTree
    );
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.store.spec.ts`
    );

    expect(content).toMatch(/FooStore/i);
    expect(content).toMatchSnapshot();
  });
});
