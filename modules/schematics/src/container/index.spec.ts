import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ContainerOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
} from '@ngrx/schematics-core/testing';

describe('Container Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );

  const defaultOptions: ContainerOptions = {
    name: 'foo',
    project: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    changeDetection: 'Default',
    style: 'css',
    module: undefined,
    export: false,
    prefix: 'app',
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should respect the state option if not provided', async () => {
    const options = { ...defaultOptions, state: undefined };
    const tree = await schematicRunner.runSchematic(
      'container',
      options,
      appTree
    );
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).not.toMatch(/fromStore/);
    expect(content).toMatchSnapshot();
  });

  it('should remove .ts from the state path if provided', async () => {
    const options = { ...defaultOptions, state: 'reducers/foo.ts' };
    appTree.create(`${projectPath}/src/app/reducers/foo.ts`, '');
    const tree = await schematicRunner.runSchematic(
      'container',
      options,
      appTree
    );
    expect(
      tree.exists(`${projectPath}/src/app/foo/foo.component.ts`)
    ).toBeTruthy();
  });

  it('should remove index.ts from the state path if provided', async () => {
    const options = { ...defaultOptions, state: 'reducers/index.ts' };
    appTree.create(`${projectPath}/src/app/reducers/index.ts`, '');
    const tree = await schematicRunner.runSchematic(
      'container',
      options,
      appTree
    );
    expect(
      tree.exists(`${projectPath}/src/app/foo/foo.component.ts`)
    ).toBeTruthy();
  });

  it('should import Store into the component', async () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create(`${projectPath}/src/app/reducers`, '');
    const tree = await schematicRunner.runSchematic(
      'container',
      options,
      appTree
    );
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).toMatch(/Store/);
    expect(content).toMatchSnapshot();
  });

  it('should update the component spec', async () => {
    const options = { ...defaultOptions, testDepth: 'unit' };
    const tree = await schematicRunner.runSchematic(
      'container',
      options,
      appTree
    );
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.spec.ts`
    );
    expect(content).toMatchSnapshot();
  });

  it('should use StoreModule if integration test', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner.runSchematic(
      'container',
      options,
      appTree
    );
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.spec.ts`
    );
    expect(content).toMatchSnapshot();
  });

  describe('standalone', () => {
    it('should be disabled by default', async () => {
      const options = { ...defaultOptions, standalone: false };
      const tree = await schematicRunner.runSchematic(
        'container',
        options,
        appTree
      );
      const content = tree.readContent(
        `${projectPath}/src/app/foo/foo.component.ts`
      );
      expect(content).not.toMatch(/standalone: true/);
    });

    it('should create a standalone component if true', async () => {
      const options = { ...defaultOptions, standalone: true };
      const tree = await schematicRunner.runSchematic(
        'container',
        options,
        appTree
      );
      const content = tree.readContent(
        `${projectPath}/src/app/foo/foo.component.ts`
      );
      expect(content).toMatch(/standalone: true/);
      expect(content).toMatchSnapshot();
    });
  });

  describe('display-block', () => {
    it('should be disabled by default', async () => {
      const options = { ...defaultOptions };
      const tree = await schematicRunner.runSchematic(
        'container',
        options,
        appTree
      );
      const content = tree.readContent(
        `${projectPath}/src/app/foo/foo.component.css`
      );
      expect(content).not.toMatch(/display: block/);
      expect(content).toMatchSnapshot();
    });

    it('should create add style if true', async () => {
      const options = { ...defaultOptions, displayBlock: true };
      const tree = await schematicRunner.runSchematic(
        'container',
        options,
        appTree
      );
      const content = tree.readContent(
        `${projectPath}/src/app/foo/foo.component.css`
      );
      expect(content).toMatch(/display: block/);
      expect(content).toMatchSnapshot();
    });
  });
});
