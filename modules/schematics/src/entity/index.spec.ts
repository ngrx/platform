import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { getFileContent, createAppModule } from '../utility/test';
import { Schema as EntityOptions } from './schema';
import { Tree, VirtualTree } from '@angular-devkit/schematics';

describe('Entity Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
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
});
