import { Tree, VirtualTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createAppModule, getFileContent } from '../utility/test';
import { Schema as ContainerOptions } from '@schematics/angular/component/schema';

describe('Container Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );

  const defaultOptions: ContainerOptions = {
    name: 'foo',
    path: 'projects/bar/src/app',
    inlineStyle: false,
    inlineTemplate: false,
    changeDetection: 'Default',
    styleext: 'css',
    spec: true,
    module: undefined,
    export: false,
    prefix: 'app',
  };

  const workspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0',
  };

  const appOptions = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    viewEncapsulation: 'Emulated',
    routing: false,
    style: 'css',
    skipTests: false,
  };

  const moduleOptions = {
    name: 'foo',
    spec: true,
    module: undefined,
    flat: false,
  };

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = schematicRunner.runExternalSchematic(
      '@schematics/angular',
      'workspace',
      workspaceOptions
    );
    appTree = schematicRunner.runExternalSchematic(
      '@schematics/angular',
      'application',
      appOptions,
      appTree
    );
  });

  it('should respect the state option if not provided', () => {
    const options = { ...defaultOptions, state: undefined };
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      '/projects/bar/src/app/foo/foo.component.ts'
    );
    expect(content).not.toMatch(/import \* as fromStore/);
  });

  it('should import the state path if provided', () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create('/projects/bar/src/app/reducers', '');
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      '/projects/bar/src/app/foo/foo.component.ts'
    );
    expect(content).toMatch(/import \* as fromStore from '..\/reducers';/);
  });

  it('should import Store into the component', () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create('/projects/bar/src/app/reducers', '');
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      '/projects/bar/src/app/foo/foo.component.ts'
    );
    expect(content).toMatch(/import\ {\ Store\ }\ from\ '@ngrx\/store';/);
  });

  it('should update the component constructor if the state path if provided', () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create('/projects/bar/src/app/reducers', '');
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      '/projects/bar/src/app/foo/foo.component.ts'
    );
    expect(content).toMatch(
      /constructor\(private store\: Store\<fromStore\.State\>\) { }\n\n/
    );
  });

  it('should update the component spec', () => {
    const options = { ...defaultOptions, spec: true };
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      '/projects/bar/src/app/foo/foo.component.spec.ts'
    );

    expect(content).toMatch(
      /import { Store, StoreModule } from '@ngrx\/store';/
    );
  });
});
