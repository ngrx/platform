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

  it('should create a const for the action creator', async () => {
    const options = {
      ...defaultOptions,
    };

    const tree = await schematicRunner.runSchematic('action', options, appTree);
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.actions.ts`
    );

    expect(fileContent).toMatch(
      /export const FooActions = createActionGroup\(/
    );
    expect(fileContent).toMatch(new RegExp(`source: 'Foo'`));
    expect(fileContent).toMatch(/Load Foos'/);
  });

  it('should create success/error actions when the api flag is set', async () => {
    const options = {
      ...defaultOptions,
      api: true,
    };

    const tree = await schematicRunner.runSchematic('action', options, appTree);
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.actions.ts`
    );

    expect(fileContent).toMatch(
      /export const FooActions = createActionGroup\(/
    );
    expect(fileContent).toMatch(new RegExp(`source: 'Foo'`));
    expect(fileContent).toMatch(/Load Foos Success/);
    expect(fileContent).toMatch(/props<{ data: unknown }>\(\)/);
    expect(fileContent).toMatch(/Load Foos Failure/);
    expect(fileContent).toMatch(/props<{ error: unknown }>\(\)/);
  });

  it.each(['load', 'delete', 'update'])(
    'should create a action with prefix',
    async (prefix) => {
      const options = {
        ...defaultOptions,
        prefix: prefix,
      };

      const tree = await schematicRunner.runSchematic(
        'action',
        options,
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );
      expect(fileContent).toMatch(
        new RegExp(`export const FooActions = createActionGroup`)
      );
      expect(fileContent).toMatch(new RegExp(`source: 'Foo'`));
      expect(fileContent).toMatch(
        new RegExp(`'${capitalize(prefix)} Foos': emptyProps\\(\\),`)
      );
    }
  );

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

    it('should create a success class based on the provided name, given api', async () => {
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

      expect(fileContent).toMatch(
        /'Load Foos Success': props<\{ data: unknown }>\(\),/
      );
    });

    it('should create a failure class based on the provided name, given api', async () => {
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

      expect(fileContent).toMatch(
        /'Load Foos Failure': props<\{ error: unknown }>\(\),/
      );
    });
  });
});
