import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as ContainerOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
} from '@ngrx/schematics-core/testing';

describe('Container Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );

  const defaultOptions: ContainerOptions = {
    name: 'foo',
    project: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    changeDetection: 'Default',
    style: 'css',
    module: undefined,
    export: false,
    prefix: 'app',
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should respect the state option if not provided', async () => {
    const options = { ...defaultOptions, state: undefined };
    const tree = await schematicRunner
      .runSchematicAsync('container', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).not.toMatch(/import \* as fromStore/);
  });

  it('should import the state path if provided', async () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create(`${projectPath}/src/app/reducers`, '');
    const tree = await schematicRunner
      .runSchematicAsync('container', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).toMatch(/import \* as fromStore from '..\/reducers';/);
  });

  it('should remove .ts from the state path if provided', async () => {
    const options = { ...defaultOptions, state: 'reducers/foo.ts' };
    appTree.create(`${projectPath}/src/app/reducers/foo.ts`, '');
    const tree = await schematicRunner
      .runSchematicAsync('container', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).toMatch(/import \* as fromStore from '..\/reducers\/foo';/);
  });

  it('should remove index.ts from the state path if provided', async () => {
    const options = { ...defaultOptions, state: 'reducers/index.ts' };
    appTree.create(`${projectPath}/src/app/reducers/index.ts`, '');
    const tree = await schematicRunner
      .runSchematicAsync('container', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).toMatch(/import \* as fromStore from '..\/reducers';/);
  });

  it('should import Store into the component', async () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create(`${projectPath}/src/app/reducers`, '');
    const tree = await schematicRunner
      .runSchematicAsync('container', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );
    expect(content).toMatch(/import { Store } from '@ngrx\/store';/);
  });

  it('should update the component constructor if the state path if provided', async () => {
    const options = { ...defaultOptions, state: 'reducers' };
    appTree.create(`${projectPath}/src/app/reducers`, '');
    const tree = await schematicRunner
      .runSchematicAsync('container', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.ts`
    );

    expect(content).toMatch(/constructor\(private store: Store\) { }\n\n/);
  });

  it('should update the component spec', async () => {
    const options = { ...defaultOptions, testDepth: 'unit' };
    const tree = await schematicRunner
      .runSchematicAsync('container', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.spec.ts`
    );
    expect(content).toMatch(
      /import { provideMockStore, MockStore } from '@ngrx\/store\/testing';/
    );
  });

  it('should use the provideMockStore helper if unit', async () => {
    const options = { ...defaultOptions, testDepth: 'unit' };
    const tree = await schematicRunner
      .runSchematicAsync('container', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.spec.ts`
    );
    expect(content).toMatch(/providers: \[ provideMockStore\(\) \]/);
  });

  it('should inject Store correctly', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner
      .runSchematicAsync('container', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.spec.ts`
    );
    expect(content).toMatch(/store = TestBed\.inject\(Store\);/);
  });

  it('should use StoreModule if integration test', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner
      .runSchematicAsync('container', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.component.spec.ts`
    );
    expect(content).toMatch(
      /import { Store, StoreModule } from '@ngrx\/store';/
    );
  });
});
