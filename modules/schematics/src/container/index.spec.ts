import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ContainerOptions } from './schema';
import {} from '../../schematics-core';
import {
  getTestProjectPath,
  createWorkspace,
} from '../../../schematics-core/testing';

describe('Container Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );

  const defaultOptions: ContainerOptions = {
    name: 'foo',
    project: 'bar',
    // path: 'src/app',
    inlineStyle: false,
    inlineTemplate: false,
    changeDetection: 'Default',
    styleext: 'css',
    spec: true,
    module: undefined,
    export: false,
    prefix: 'app',
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
  });

  it('should respect the state option if not provided', () => {
    const options = { ...defaultOptions, state: undefined };
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).not.toMatch(/import \* as fromStore/);
  });

  it('should import the state path if provided', () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create(`${projectPath}/src/app/reducers`, '');
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).toMatch(/import \* as fromStore from '..\/reducers';/);
  });

  it('should remove .ts from the state path if provided', () => {
    const options = { ...defaultOptions, state: 'reducers/foo.ts' };
    appTree.create(`${projectPath}/src/app/reducers/foo.ts`, '');
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).toMatch(/import \* as fromStore from '..\/reducers\/foo';/);
  });

  it('should remove index.ts from the state path if provided', () => {
    const options = { ...defaultOptions, state: 'reducers/index.ts' };
    appTree.create(`${projectPath}/src/app/reducers/index.ts`, '');
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).toMatch(/import \* as fromStore from '..\/reducers';/);
  });

  it('should import Store into the component', () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create(`${projectPath}/src/app/reducers`, '');
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).toMatch(/import\ {\ Store\ }\ from\ '@ngrx\/store';/);
  });

  it('should update the component constructor if the state path if provided', () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create(`${projectPath}/src/app/reducers`, '');
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).toMatch(
      /constructor\(private store\: Store\<fromStore\.State\>\) { }\n\n/
    );
  });

  it('should update the component spec', () => {
    const options = { ...defaultOptions, spec: true };
    const tree = schematicRunner.runSchematic('container', options, appTree);
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.spec.ts`
    );
    expect(content).toMatch(
      /import { Store, StoreModule } from '@ngrx\/store';/
    );
  });
});
