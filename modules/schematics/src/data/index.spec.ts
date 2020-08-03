import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as DataOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
  defaultWorkspaceOptions,
  defaultAppOptions,
} from '@ngrx/schematics-core/testing';

describe('Data Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: DataOptions = {
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

  it('should create the data service to a specified project if provided', async () => {
    const options = { ...defaultOptions, project: 'baz' };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = await schematicRunner
      .runSchematicAsync('data', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.service.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create the service and model files', async () => {
    const tree = await schematicRunner
      .runSchematicAsync('data', defaultOptions, appTree)
      .toPromise();
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.service.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create two files if skipTests is false(as it is by default)', async () => {
    const options = {
      ...defaultOptions,
    };
    const tree = await schematicRunner
      .runSchematicAsync('data', options, appTree)
      .toPromise();
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.service.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo.service.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  describe('service class', () => {
    it('should import the correct model', async () => {
      const options = { ...defaultOptions };
      const tree = await schematicRunner
        .runSchematicAsync('data', options, appTree)
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.service.ts`
      );

      expect(fileContent).toMatch(/import { Foo } from '.\/foo';/);
    });

    it('should extending EntityCollectionServiceBase', async () => {
      const options = { ...defaultOptions };
      const tree = await schematicRunner
        .runSchematicAsync('data', options, appTree)
        .toPromise();
      const fileContent = tree.readContent(
        `${projectPath}/src/app/foo.service.ts`
      );

      expect(fileContent).toMatch(
        /export class FooService extends EntityCollectionServiceBase<Foo>/
      );

      expect(fileContent).toMatch(/super\('Foo', serviceElementsFactory\);/);
    });
  });

  it('should create model', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner
      .runSchematicAsync('data', options, appTree)
      .toPromise();
    const fileContent = tree.readContent(`${projectPath}/src/app/foo.ts`);

    expect(fileContent).toMatch(/export interface Foo {/);
    expect(fileContent).toMatch(/id\?: any;/);
  });

  it('should create spec class with right imports', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner
      .runSchematicAsync('data', options, appTree)
      .toPromise();
    const fileContent = tree.readContent(
      `${projectPath}/src/app/foo.service.spec.ts`
    );

    expect(fileContent).toMatch(/import { FooService } from '.\/foo.service'/);
  });
});
