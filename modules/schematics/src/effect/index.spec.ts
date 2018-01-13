import { Tree, VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {
  createAppModule,
  getFileContent,
  createAppModuleWithEffects,
} from '../utility/test';
import { Schema as EffectOptions } from './schema';

describe('Effect Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );
  const defaultOptions: EffectOptions = {
    name: 'foo',
    path: 'app',
    sourceDir: 'src',
    spec: true,
    module: undefined,
    flat: false,
    feature: false,
    root: false,
  };

  let appTree: Tree;

  beforeEach(() => {
    appTree = new VirtualTree();
    appTree = createAppModule(appTree);
  });

  it('should create an effect', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf('/src/app/foo/foo.effects.spec.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/src/app/foo/foo.effects.ts')).toBeGreaterThanOrEqual(
      0
    );
  });

  it('should not be provided by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = getFileContent(tree, '/src/app/app.module.ts');
    expect(content).not.toMatch(
      /import { FooEffects } from '.\/foo\/foo.effects'/
    );
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = getFileContent(tree, '/src/app/app.module.ts');
    expect(content).toMatch(/import { FooEffects } from '.\/foo\/foo.effects'/);
  });

  it('should fail if specified module does not exist', () => {
    const options = { ...defaultOptions, module: '/src/app/app.moduleXXX.ts' };
    let thrownError: Error | null = null;
    try {
      schematicRunner.runSchematic('effects', options, appTree);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should respect the spec flag', () => {
    const options = { ...defaultOptions, spec: false };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const files = tree.files;
    expect(files.indexOf('/src/app/foo/foo.effects.ts')).toBeGreaterThanOrEqual(
      0
    );
    expect(files.indexOf('/src/app/foo/foo.effects.spec.ts')).toEqual(-1);
  });

  it('should register the root effect in the provided module', () => {
    const options = { ...defaultOptions, root: true, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = getFileContent(tree, '/src/app/app.module.ts');

    expect(content).toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });

  it('should register the feature effect in the provided module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = getFileContent(tree, '/src/app/app.module.ts');

    expect(content).toMatch(/EffectsModule\.forFeature\(\[FooEffects\]\)/);
  });

  it('should add an effect to the empty array of registered effects', () => {
    const storeModule = '/src/app/store.module.ts';
    const options = { ...defaultOptions, module: 'store.module.ts' };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot([])'
    );

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = getFileContent(tree, storeModule);

    expect(content).toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });

  it('should add an effect to the existing registered effects', () => {
    const storeModule = '/src/app/store.module.ts';
    const options = { ...defaultOptions, module: 'store.module.ts' };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot([UserEffects])'
    );

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = getFileContent(tree, '/src/app/store.module.ts');

    expect(content).toMatch(
      /EffectsModule\.forRoot\(\[UserEffects, FooEffects\]\)/
    );
  });

  it('should not add an effect to registered effects defined with a variable', () => {
    const storeModule = '/src/app/store.module.ts';
    const options = { ...defaultOptions, module: 'store.module.ts' };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot(effects)'
    );

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = getFileContent(tree, '/src/app/store.module.ts');

    expect(content).not.toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });
});
