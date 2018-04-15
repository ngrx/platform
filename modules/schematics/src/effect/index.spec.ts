import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {
  createAppModule,
  getFileContent,
  createAppModuleWithEffects,
} from '../utility/test';
import { Schema as EffectOptions } from './schema';
import {
  getProjectPath,
  createWorkspace,
} from '../utility/test/create-workspace';

describe('Effect Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );

  const defaultOptions: EffectOptions = {
    name: 'foo',
    // path: 'app',
    project: 'bar',
    spec: true,
    module: undefined,
    flat: false,
    feature: false,
    root: false,
    group: false,
  };

  const projectPath = getProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
  });

  it('should create an effect', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should not be provided by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).not.toMatch(
      /import { FooEffects } from '.\/foo\/foo.effects'/
    );
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(/import { FooEffects } from '.\/foo\/foo.effects'/);
  });

  it('should fail if specified module does not exist', () => {
    const options = {
      ...defaultOptions,
      module: `${projectPath}/src/app/app.moduleXXX.ts`,
    };
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
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.spec.ts`)
    ).toEqual(-1);
  });

  it('should register the root effect in the provided module', () => {
    const options = { ...defaultOptions, root: true, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });

  it('should register the feature effect in the provided module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/EffectsModule\.forFeature\(\[FooEffects\]\)/);
  });

  it('should add an effect to the empty array of registered effects', () => {
    const storeModule = `${projectPath}/src/app/store.module.ts`;
    const options = {
      ...defaultOptions,
      root: true,
      module: 'store.module.ts',
    };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot([])'
    );

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = tree.readContent(storeModule);

    expect(content).toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });

  it('should add an effect to the existing registered root effects', () => {
    const storeModule = `${projectPath}/src/app/store.module.ts`;
    const options = {
      ...defaultOptions,
      root: true,
      module: 'store.module.ts',
    };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot([UserEffects])'
    );

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = tree.readContent(storeModule);

    expect(content).toMatch(
      /EffectsModule\.forRoot\(\[UserEffects, FooEffects\]\)/
    );
  });

  it('should add an effect to the existing registered feature effects', () => {
    const storeModule = `${projectPath}/src/app/store.module.ts`;
    const options = { ...defaultOptions, module: 'store.module.ts' };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      `EffectsModule.forRoot([RootEffects])\n    EffectsModule.forFeature([UserEffects])`
    );

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = tree.readContent(storeModule);

    expect(content).toMatch(
      /EffectsModule\.forFeature\(\[UserEffects, FooEffects\]\)/
    );
  });

  it('should not add an effect to registered effects defined with a variable', () => {
    const storeModule = `${projectPath}/src/app/store.module.ts`;
    const options = { ...defaultOptions, module: 'store.module.ts' };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot(effects)'
    );

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const content = tree.readContent(storeModule);

    expect(content).not.toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });

  it('should group within an "effects" folder if group is set', () => {
    const options = { ...defaultOptions, flat: true, spec: false, group: true };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/effects/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should group and nest the effect within a feature', () => {
    const options = {
      ...defaultOptions,
      spec: false,
      group: true,
      flat: false,
      feature: true,
    };

    const tree = schematicRunner.runSchematic('effect', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/effects/foo/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);

    const content = tree.readContent(
      `${projectPath}/src/app/effects/foo/foo.effects.ts`
    );

    expect(content).toMatch(
      /import\ \{\ FooActions,\ FooActionTypes\ }\ from\ \'\.\.\/\.\.\/actions\/foo\/foo\.actions';/
    );
  });
});
