import { Tree, VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createAppModule, getFileContent } from './utils';
import { ContainerOptions } from '../src/container';

describe('Container Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: ContainerOptions = {
    name: 'foo',
    path: 'app',
    sourceDir: 'src',
    inlineStyle: false,
    inlineTemplate: false,
    changeDetection: 'Default',
    routing: false,
    styleext: 'css',
    spec: true,
    module: undefined,
    export: false,
    prefix: undefined,
  };

  let appTree: Tree;

  beforeEach(() => {
    appTree = new VirtualTree();
    appTree = createAppModule(appTree);
  });

  it('should respect the state option if not provided', () => {
    const options = { ...defaultOptions, state: undefined };
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = getFileContent(tree, '/src/app/foo/foo.component.ts');
    expect(content).not.toMatch(/import \* as fromStore/);
  });

  it('should import the state path if provided', () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create('/src/app/reducers', '');
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = getFileContent(tree, '/src/app/foo/foo.component.ts');
    expect(content).toMatch(/import \* as fromStore from '..\/reducers';/);
  });

  it('should import Store into the component', () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create('/src/app/reducers', '');
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = getFileContent(tree, '/src/app/foo/foo.component.ts');
    expect(content).toMatch(/import\ {\ Store\ }\ from\ '@ngrx\/store';/);
  });

  it('should update the component constructor if the state path if provided', () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create('/src/app/reducers', '');
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = getFileContent(tree, '/src/app/foo/foo.component.ts');
    expect(content).toMatch(
      /constructor\(private store\: Store\<fromStore\.State\>\) { }\n\n/
    );
  });

  it('should update the component spec', () => {
    const options = { ...defaultOptions, spec: true };
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = getFileContent(tree, '/src/app/foo/foo.component.spec.ts');

    expect(content).toMatch(
      /import { Store, StoreModule } from '@ngrx\/store';/
    );
  });
});
