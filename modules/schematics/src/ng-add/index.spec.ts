import { Tree, VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createAppModule, getFileContent } from '../utility/test';
import { Schema as NgAddOptions } from './schema';

describe('NgAdd Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: NgAddOptions = {
    path: 'app',
    sourceDir: 'src',
    name: 'foo',
    effectName: 'bar',
    effect: true,
    module: undefined,
    flat: false,
    spec: true,
    group: false,
  };

  let appTree: Tree;

  beforeEach(() => {
    appTree = new VirtualTree();
    appTree = createAppModule(appTree);
  });

  it('should setup root store and effect', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = getFileContent(tree, '/src/app/app.module.ts');

    expect(content).toMatch(/import { StoreModule } from '@ngrx\/store';/);
    expect(content).toMatch(/import { EffectsModule } from '@ngrx\/effects';/);
    expect(content).toMatch(
      /import { StoreDevtoolsModule } from '@ngrx\/store-devtools';/
    );
    expect(content).toMatch(
      /import { reducers, metaReducers } from '\.\/reducers';/
    );
    expect(content).toMatch(
      /StoreModule\.forRoot\(reducers, { metaReducers }\)/
    );
    expect(content).toMatch(/EffectsModule\.forRoot\(\[BarEffects\]\)/);
    expect(content).toMatch(
      /!environment\.production \? StoreDevtoolsModule\.instrument\(\) : \[\]/
    );
  });

  it('should create state and feature files', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const files = tree.files;

    expect(files.indexOf('/src/app/reducers/index.ts')).toBeGreaterThanOrEqual(
      0
    );
    expect(
      files.indexOf('/src/app/bar/bar.effects.spec.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/src/app/bar/bar.effects.ts')).toBeGreaterThanOrEqual(
      0
    );
  });

  it('should not create feature files', () => {
    const options = { ...defaultOptions, effect: false };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const files = tree.files;

    expect(files.indexOf('/src/app/bar/bar.effects.spec.ts')).toEqual(-1);
    expect(files.indexOf('/src/app/bar/bar.effects.ts')).toEqual(-1);
  });
});
