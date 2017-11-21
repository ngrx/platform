import { Tree, VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createAppModule, getFileContent } from '../utility/test';
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
});
