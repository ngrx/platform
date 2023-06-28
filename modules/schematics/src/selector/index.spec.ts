import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as SelectorOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
} from '@ngrx/schematics-core/testing';

describe('Selector Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: SelectorOptions = {
    name: 'foo',
    project: 'bar',
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create selector files', async () => {
    const tree = await schematicRunner.runSchematic(
      'selector',
      defaultOptions,
      appTree
    );

    const selectorPath = `${projectPath}/src/app/foo.selectors.ts`;
    const specPath = `${projectPath}/src/app/foo.selectors.spec.ts`;

    expect(tree.files.includes(selectorPath)).toBeTruthy();
    expect(tree.files.includes(specPath)).toBeTruthy();

    expect(tree.readContent(selectorPath)).toMatchSnapshot();
    expect(tree.readContent(specPath)).toMatchSnapshot();
  });

  it('should not create a spec file if spec is false', async () => {
    const options = {
      ...defaultOptions,
      skipTests: true,
    };
    const tree = await schematicRunner.runSchematic(
      'selector',
      options,
      appTree
    );

    expect(
      tree.files.includes(`${projectPath}/src/app/foo.selectors.spec.ts`)
    ).toBeFalsy();
  });

  it('should group selectors if group is true', async () => {
    const options = {
      ...defaultOptions,
      group: true,
    };
    const tree = await schematicRunner.runSchematic(
      'selector',
      options,
      appTree
    );

    const selectorPath = `${projectPath}/src/app/selectors/foo.selectors.ts`;
    const specPath = `${projectPath}/src/app/selectors/foo.selectors.spec.ts`;

    expect(tree.files.includes(selectorPath)).toBeTruthy();
    expect(tree.files.includes(specPath)).toBeTruthy();

    expect(tree.readContent(selectorPath)).toMatchSnapshot();
    expect(tree.readContent(specPath)).toMatchSnapshot();
  });

  it('should not flatten selectors if flat is false', async () => {
    const options = {
      ...defaultOptions,
      flat: false,
    };
    const tree = await schematicRunner.runSchematic(
      'selector',
      options,
      appTree
    );

    const selectorPath = `${projectPath}/src/app/foo/foo.selectors.ts`;
    const specPath = `${projectPath}/src/app/foo/foo.selectors.spec.ts`;

    expect(tree.files.includes(selectorPath)).toBeTruthy();
    expect(tree.files.includes(specPath)).toBeTruthy();

    expect(tree.readContent(selectorPath)).toMatchSnapshot();
    expect(tree.readContent(specPath)).toMatchSnapshot();
  });

  describe('With feature flag', () => {
    it('should create a selector', async () => {
      const options = {
        ...defaultOptions,
        feature: true,
      };

      const tree = await schematicRunner.runSchematic(
        'selector',
        options,
        appTree
      );

      const selectorPath = `${projectPath}/src/app/foo.selectors.ts`;
      const specPath = `${projectPath}/src/app/foo.selectors.spec.ts`;

      expect(tree.files.includes(selectorPath)).toBeTruthy();
      expect(tree.files.includes(specPath)).toBeTruthy();

      expect(tree.readContent(selectorPath)).toMatchSnapshot();
      expect(tree.readContent(specPath)).toMatchSnapshot();
    });

    it('should group and nest the selectors within a feature', async () => {
      const options = {
        ...defaultOptions,
        feature: true,
        group: true,
        flat: false,
      };

      const tree = await schematicRunner.runSchematic(
        'selector',
        options,
        appTree
      );
      const selectorPath = `${projectPath}/src/app/selectors/foo/foo.selectors.ts`;
      const specPath = `${projectPath}/src/app/selectors/foo/foo.selectors.spec.ts`;

      expect(tree.files.includes(selectorPath)).toBeTruthy();
      expect(tree.files.includes(specPath)).toBeTruthy();

      expect(tree.readContent(selectorPath)).toMatchSnapshot();
      expect(tree.readContent(specPath)).toMatchSnapshot();
    });
  });
});
