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
} from '../../../schematics-core/testing';

describe('Action Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: ActionOptions = {
    name: 'foo',
    project: 'bar',
    group: false,
    flat: true,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create an action to specified project if provided', () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = schematicRunner.runSchematic('action', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create one file', () => {
    const tree = schematicRunner.runSchematic(
      'action',
      defaultOptions,
      appTree
    );
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create two files test files by default', () => {
    const options = {
      ...defaultOptions,
    };
    const tree = schematicRunner.runSchematic('action', options, appTree);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should not create two files test files when skipTests is set to true', () => {
    const options = {
      ...defaultOptions,
      skipTests: false,
    };
    const tree = schematicRunner.runSchematic('action', options, appTree);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.actions.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  describe('action classes', () => {
    const actionClassesDefaultOptions = { ...defaultOptions, creators: false };

    it('should create an enum named "Foo"', () => {
      const tree = schematicRunner.runSchematic(
        'action',
        actionClassesDefaultOptions,
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(/export enum FooActionTypes/);
    });

    it('should create a class based on the provided name', () => {
      const tree = schematicRunner.runSchematic(
        'action',
        actionClassesDefaultOptions,
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(/export class LoadFoos implements Action/);
    });

    it('should create the union type based on the provided name', () => {
      const tree = schematicRunner.runSchematic(
        'action',
        actionClassesDefaultOptions,
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(/export type FooActions = LoadFoos/);
    });

    it('should create spec class with right imports', () => {
      const options = { ...actionClassesDefaultOptions };
      const tree = schematicRunner.runSchematic('action', options, appTree);
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.spec.ts`
      );

      expect(fileContent).toMatch(/expect\(new FooActions.LoadFoos\(\)\)/);
    });
  });

  describe('action creators', () => {
    const creatorDefaultOptions = { ...defaultOptions };

    it('should create a const for the action creator', () => {
      const tree = schematicRunner.runSchematic(
        'action',
        creatorDefaultOptions,
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(/export const loadFoos = createAction\(/);
      expect(fileContent).toMatch(/\[Foo\] Load Foos'/);
    });

    it('should create success/error actions when the api flag is set', () => {
      const tree = schematicRunner.runSchematic(
        'action',
        { ...creatorDefaultOptions, api: true },
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(/export const loadFoos = createAction\(/);
      expect(fileContent).toMatch(/\[Foo\] Load Foos Success/);
      expect(fileContent).toMatch(/props<{ data: any }>\(\)/);
      expect(fileContent).toMatch(/\[Foo\] Load Foos Failure/);
      expect(fileContent).toMatch(/props<{ error: any }>\(\)/);
    });
  });

  describe('api', () => {
    it('should group within an "actions" folder if group is set', () => {
      const tree = schematicRunner.runSchematic(
        'action',
        {
          ...defaultOptions,
          group: true,
        },
        appTree
      );
      expect(
        tree.files.indexOf(`${projectPath}/src/app/actions/foo.actions.ts`)
      ).toBeGreaterThanOrEqual(0);
    });

    it('should create a success class based on the provided name, given api', () => {
      const tree = schematicRunner.runSchematic(
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
        /export const loadFoosSuccess = createAction\(\r?\n?\s*'\[Foo\] Load Foos Success'\r?\n?\s*,/
      );
    });

    it('should create a failure class based on the provided name, given api', () => {
      const tree = schematicRunner.runSchematic(
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
        /export const loadFoosFailure = createAction\(\r?\n?\s*'\[Foo\] Load Foos Failure'\r?\n?\s*,/
      );
    });

    it('should create the union type with success and failure based on the provided name, given api and creators false', () => {
      const tree = schematicRunner.runSchematic(
        'action',
        {
          ...defaultOptions,
          api: true,
          creators: false,
        },
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(
        /export type FooActions = LoadFoos \| LoadFoosSuccess \| LoadFoosFailure/
      );
    });
  });
});
