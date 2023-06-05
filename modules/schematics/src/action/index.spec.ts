import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ActionOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
  defaultWorkspaceOptions,
  defaultAppOptions,
} from '@ngrx/schematics-core/testing';
import { capitalize } from '../../schematics-core/utility/strings';

describe('Action Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: ActionOptions = {
    name: 'foo',
    prefix: 'load',
    project: 'bar',
    group: false,
    flat: true,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create an action to specified project if provided', async () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = await schematicRunner.runSchematic('action', options, appTree);
    const files = tree.files;
    expect(
      files.includes(`${specifiedProjectPath}/src/lib/foo.actions.ts`)
    ).toBeTruthy();
  });

  it('should create one file', async () => {
    const tree = await schematicRunner.runSchematic(
      'action',
      defaultOptions,
      appTree
    );
    expect(
      tree.files.includes(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeTruthy();
  });

  it('should not create test files', async () => {
    const options = {
      ...defaultOptions,
    };
    const tree = await schematicRunner.runSchematic('action', options, appTree);
    expect(
      tree.files.includes(`${projectPath}/src/app/foo.actions.spec.ts`)
    ).toBe(false);
  });

  it('should define actions using createActionGroup', async () => {
    const options = {
      ...defaultOptions,
    };

    const tree = await schematicRunner.runSchematic('action', options, appTree);
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.actions.ts`
    );

    expect(fileContent).toMatchSnapshot();
  });

  it('should create api actions (load, success, error) when the api flag is set', async () => {
    const options = {
      ...defaultOptions,
      api: true,
    };

    const tree = await schematicRunner.runSchematic('action', options, appTree);
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.actions.ts`
    );

    expect(fileContent).toMatchSnapshot();
  });

  it('should create an action with the defined prefix', async () => {
    const options = {
      ...defaultOptions,
      prefix: 'prefix',
    };

    const tree = await schematicRunner.runSchematic('action', options, appTree);
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.actions.ts`
    );
    expect(fileContent).toMatchSnapshot();
  });

  describe('api', () => {
    it('should group within an "actions" folder if group is set', async () => {
      const tree = await schematicRunner.runSchematic(
        'action',
        {
          ...defaultOptions,
          group: true,
        },
        appTree
      );
      expect(
        tree.files.includes(`${projectPath}/src/app/actions/foo.actions.ts`)
      ).toBeTruthy();
    });

    it('should create api actions', async () => {
      const tree = await schematicRunner.runSchematic(
        'action',
        {
          ...defaultOptions,
          api: true,
        },
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatchSnapshot();
    });
  });
});
