import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getFileContent, createAppModule } from './utils';
import { EntityOptions } from '../src/entity';
import { Tree, VirtualTree } from '@angular-devkit/schematics';

describe('Entity Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: EntityOptions = {
    name: 'foo',
    path: 'app',
    sourceDir: 'src',
    spec: false,
  };

  let appTree: Tree;

  beforeEach(() => {
    appTree = new VirtualTree();
    appTree = createAppModule(appTree);
  });

  it('should create 3 files', () => {
    const tree = schematicRunner.runSchematic('entity', defaultOptions);
    expect(tree.files.length).toEqual(3);
    expect(tree.files[0]).toEqual('/src/app/foo.actions.ts');
    expect(tree.files[1]).toEqual('/src/app/foo.model.ts');
    expect(tree.files[2]).toEqual('/src/app/foo.reducer.ts');
  });

  it('should create a folder if flat is false', () => {
    const tree = schematicRunner.runSchematic('entity', {
      ...defaultOptions,
      flat: false,
    });
    expect(tree.files.length).toEqual(3);
    expect(tree.files[0]).toEqual('/src/app/foo/foo.actions.ts');
    expect(tree.files[1]).toEqual('/src/app/foo/foo.model.ts');
    expect(tree.files[2]).toEqual('/src/app/foo/foo.reducer.ts');
  });

  it('should create 4 files if spec is true', () => {
    const options = {
      ...defaultOptions,
      spec: true,
    };
    const tree = schematicRunner.runSchematic('entity', options);
    expect(tree.files.length).toEqual(4);
    expect(tree.files[0]).toEqual('/src/app/foo.actions.ts');
    expect(tree.files[1]).toEqual('/src/app/foo.model.ts');
    expect(tree.files[2]).toEqual('/src/app/foo.reducer.ts');
    expect(tree.files[3]).toEqual('/src/app/foo.reducer.spec.ts');
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('entity', options, appTree);
    const content = getFileContent(tree, '/src/app/app.module.ts');

    expect(content).toMatch(/import \* as fromFoo from '\.\/foo.reducer';/);
  });

  it('should create all files of an entity within grouped and nested folders', () => {
    const options = { ...defaultOptions, flat: false, group: true, spec: true };

    const tree = schematicRunner.runSchematic('entity', options);
    const files = tree.files;
    expect(
      files.indexOf('/src/app/foo/actions/foo.actions.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/foo/models/foo.model.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/foo/reducers/foo.reducer.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/foo/reducers/foo.reducer.spec.ts')
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create all files of an entity within grouped folders if group is set', () => {
    const options = { ...defaultOptions, group: true, spec: true };

    const tree = schematicRunner.runSchematic('entity', options);
    const files = tree.files;
    expect(
      files.indexOf('/src/app/actions/foo.actions.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/models/foo.model.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/reducers/foo.reducer.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/reducers/foo.reducer.spec.ts')
    ).toBeGreaterThanOrEqual(0);
  });
});
