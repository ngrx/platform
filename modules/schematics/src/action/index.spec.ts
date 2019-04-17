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
    spec: false,
    group: false,
    flat: true,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
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

  it('should create two files if spec is true', () => {
    const options = {
      ...defaultOptions,
      spec: true,
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
    it('should create an enum named "Foo"', () => {
      const tree = schematicRunner.runSchematic(
        'action',
        defaultOptions,
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
        defaultOptions,
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
        defaultOptions,
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(/export type FooActions = LoadFoos/);
    });
  });

  describe('action creators', () => {
    const creatorOptions = { ...defaultOptions, actionCreators: true };

    it('should create a const for the action creator', () => {
      const tree = schematicRunner.runSchematic(
        'action',
        creatorOptions,
        appTree
      );
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.actions.ts`
      );

      expect(fileContent).toMatch(
        /export const loadFoos = createAction\('\[Foo\] Load Foos'\);/
      );
    });
  });

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
      /export class LoadFoosSuccess implements Action/
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
      /export class LoadFoosFailure implements Action/
    );
  });

  it('should create the union type with success and failure based on the provided name, given api', () => {
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
      /export type FooActions = LoadFoos \| LoadFoosSuccess \| LoadFoosFailure/
    );
  });
});
