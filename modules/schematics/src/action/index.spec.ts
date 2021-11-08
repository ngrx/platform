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
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create one file', async () => {
    const tree = await schematicRunner
      .runSchematicAsync('action', defaultOptions, appTree)
      .toPromise();
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create two files test files by default', async () => {
    const options = {
      ...defaultOptions,
    };
    const tree = await schematicRunner
      .runSchematicAsync('action', options, appTree)
      .toPromise();
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should not create test files when skipTests is set to true', async () => {
    const options = {
      ...defaultOptions,
      skipTests: true,
    };
    const tree = await schematicRunner
      .runSchematicAsync('action', options, appTree)
      .toPromise();
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.spec.ts`)
    ).toEqual(-1);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  describe('action classes', () => {
    const actionClassesDefaultOptions = { ...defaultOptions, creators: false };

    it('should create an enum named "Foo"', async () => {
      const tree = await schematicRunner
        .runSchematicAsync('action', actionClassesDefaultOptions, appTree)
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(/export enum FooActionTypes/);
    });

    it('should create a class based on the provided name', async () => {
      const tree = await schematicRunner
        .runSchematicAsync('action', actionClassesDefaultOptions, appTree)
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(/export class LoadFoos implements Action/);
    });

    it('should create the union type based on the provided name', async () => {
      const tree = await schematicRunner
        .runSchematicAsync('action', actionClassesDefaultOptions, appTree)
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(/export type FooActions = LoadFoos/);
    });

    it('should create spec class with right imports', async () => {
      const options = { ...actionClassesDefaultOptions };
      const tree = await schematicRunner
        .runSchematicAsync('action', options, appTree)
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.spec.ts`
      );

      expect(fileContent).toMatch(/expect\(new FooActions.LoadFoos\(\)\)/);
    });
  });

  describe('action creators', () => {
    const creatorDefaultOptions = { ...defaultOptions };

    it('should create a const for the action creator', async () => {
      const tree = await schematicRunner
        .runSchematicAsync('action', creatorDefaultOptions, appTree)
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(/export const loadFoos = createAction\(/);
      expect(fileContent).toMatch(/\[Foo\] Load Foos'/);
    });

    it('should create success/error actions when the api flag is set', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'action',
          { ...creatorDefaultOptions, api: true },
          appTree
        )
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
        const tree = await schematicRunner
          .runSchematicAsync(
            'action',
            { ...creatorDefaultOptions, prefix: prefix },
            appTree
          )
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
  });

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
        tree.files.indexOf(`${projectPath}/src/app/actions/foo.actions.ts`)
      ).toBeGreaterThanOrEqual(0);
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

    it('should create the union type with success and failure based on the provided name, given api and creators false', async () => {
      const tree = await schematicRunner
        .runSchematicAsync(
          'action',
          {
            ...defaultOptions,
            api: true,
            creators: false,
          },
          appTree
        )
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(
        /export type FooActions = LoadFoos \| LoadFoosSuccess \| LoadFoosFailure/
      );
    });
  });
});
