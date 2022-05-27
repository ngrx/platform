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

    const tree = await schematicRunner
      .runSchematicAsync('action', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.includes(`${specifiedProjectPath}/src/lib/foo.actions.ts`)
    ).toBeTruthy();
  });

  it('should create one file', async () => {
    const tree = await schematicRunner
      .runSchematicAsync('action', defaultOptions, appTree)
      .toPromise();
    expect(
      tree.files.includes(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeTruthy();
  });

  it('should not create test files', async () => {
    const options = {
      ...defaultOptions,
    };
    const tree = await schematicRunner
      .runSchematicAsync('action', options, appTree)
      .toPromise();
    expect(
      tree.files.includes(`${projectPath}/src/app/foo.actions.spec.ts`)
    ).toBe(false);
  });

  it('should create a const for the action creator', async () => {
    const options = {
      ...defaultOptions,
    };

    const tree = await schematicRunner
      .runSchematicAsync('action', options, appTree)
      .toPromise();
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.actions.ts`
    );

    expect(fileContent).toMatch(/export const loadFoos = createAction\(/);
    expect(fileContent).toMatch(/\[Foo\] Load Foos'/);
  });

  it('should create success/error actions when the api flag is set', async () => {
    const options = {
      ...defaultOptions,
      api: true,
    };

    const tree = await schematicRunner
      .runSchematicAsync('action', options, appTree)
      .toPromise();
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.actions.ts`
    );

    expect(fileContent).toMatch(/export const loadFoos = createAction\(/);
    expect(fileContent).toMatch(/\[Foo\] Load Foos Success/);
    expect(fileContent).toMatch(/props<{ data: any }>\(\)/);
    expect(fileContent).toMatch(/\[Foo\] Load Foos Failure/);
    expect(fileContent).toMatch(/props<{ error: any }>\(\)/);
  });

  it.each(['load', 'delete', 'update'])(
    'should create a action with prefix',
    async (prefix) => {
      const options = {
        ...defaultOptions,
        prefix: prefix,
      };

      const tree = await schematicRunner
        .runSchematicAsync('action', options, appTree)
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );
      expect(fileContent).toMatch(
        new RegExp(`export const ${prefix}Foos = createAction`)
      );
      expect(fileContent).toMatch(
        new RegExp(`'\\[Foo] ${capitalize(prefix)} Foos'`)
      );
    }
  );

  describe('api', () => {
    it('should group within an "actions" folder if group is set', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'action',
          {
            ...defaultOptions,
            group: true,
          },
          appTree
        )
        .toPromise();
      expect(
        tree.files.includes(`${projectPath}/src/app/actions/foo.actions.ts`)
      ).toBeTruthy();
    });

    it('should create a success class based on the provided name, given api', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'action',
          {
            ...defaultOptions,
            api: true,
          },
          appTree
        )
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(
        /export const loadFoosSuccess = createAction\(\r?\n?\s*'\[Foo\] Load Foos Success'\r?\n?\s*,/
      );
    });

    it('should create a failure class based on the provided name, given api', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'action',
          {
            ...defaultOptions,
            api: true,
          },
          appTree
        )
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(
        /export const loadFoosFailure = createAction\(\r?\n?\s*'\[Foo\] Load Foos Failure'\r?\n?\s*,/
      );
    });
  });
});
