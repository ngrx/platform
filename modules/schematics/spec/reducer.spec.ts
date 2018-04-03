import { Tree, VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createAppModule, getFileContent, createReducers } from './utils';
import { ReducerOptions } from '../src/reducer';

describe('Reducer Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: ReducerOptions = {
    name: 'foo',
    path: 'app',
    sourceDir: 'src',
    spec: false,
  };

  let appTree: Tree;

  beforeEach(() => {
    appTree = new VirtualTree();
    appTree = createReducers(createAppModule(appTree));
  });

  it('should create one file', () => {
    const tree = schematicRunner.runSchematic('reducer', defaultOptions);
    expect(tree.files.length).toEqual(1);
    expect(tree.files[0]).toEqual('/src/app/foo.reducer.ts');
  });

  it('should create two files if spec is true', () => {
    const options = {
      ...defaultOptions,
      spec: true,
    };
    const tree = schematicRunner.runSchematic('reducer', options);
    expect(tree.files.length).toEqual(2);
    expect(
      tree.files.indexOf('/src/app/foo.reducer.spec.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf('/src/app/foo.reducer.ts')
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create an reducer function', () => {
    const tree = schematicRunner.runSchematic('reducer', defaultOptions);
    const fileEntry = tree.get(tree.files[0]);
    if (fileEntry) {
      const fileContent = fileEntry.content.toString();
      expect(fileContent).toMatch(/export function reducer/);
    }
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const appModule = getFileContent(tree, '/src/app/app.module.ts');

    expect(appModule).toMatch(/import \* as fromFoo from '.\/foo.reducer'/);
  });

  it('should import into a specified reducers', () => {
    const options = { ...defaultOptions, reducers: 'reducers/index.ts' };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const reducers = getFileContent(tree, '/src/app/reducers/index.ts');

    expect(reducers).toMatch(/import \* as fromFoo from '..\/foo.reducer'/);
  });

  it('should add the reducer State to the State interface', () => {
    const options = { ...defaultOptions, reducers: 'reducers/index.ts' };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const reducers = getFileContent(tree, '/src/app/reducers/index.ts');

    expect(reducers).toMatch(/foo\: fromFoo.State/);
  });

  it('should add the reducer function to the ActionReducerMap', () => {
    const options = { ...defaultOptions, reducers: 'reducers/index.ts' };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const reducers = getFileContent(tree, '/src/app/reducers/index.ts');

    expect(reducers).toMatch(/foo\: fromFoo.reducer/);
  });

  it('should group within a "reducers" folder if group is set', () => {
    const tree = schematicRunner.runSchematic('reducer', {
      ...defaultOptions,
      group: true,
    });
    expect(tree.files.length).toEqual(1);
    expect(tree.files[0]).toEqual('/src/app/reducers/foo.reducer.ts');
  });

  it('should group and nest the reducer within a feature', () => {
    const options = {
      ...defaultOptions,
      spec: false,
      group: true,
      flat: false,
      feature: true,
    };

    const tree = schematicRunner.runSchematic('reducer', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf('/src/app/reducers/foo/foo.reducer.ts')
    ).toBeGreaterThanOrEqual(0);

    const content = getFileContent(
      tree,
      '/src/app/reducers/foo/foo.reducer.ts'
    );

    expect(content).toMatch(
      /import\ \{\ FooActions,\ FooActionTypes\ }\ from\ \'\.\.\/\.\.\/actions\/foo\/foo\.actions';/
    );
  });
});
