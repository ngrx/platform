import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as DataEntityOptions } from './schema';
import {
  createWorkspace,
  getTestProjectPath,
} from '@ngrx/schematics-core/testing';

describe('Data ng-add Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/data',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: DataEntityOptions = {
    skipPackageJson: false,
    project: 'bar',
    module: 'app-module',
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should update package.json', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/data']).toBeDefined();
  });

  it('should skip package.json update', async () => {
    const options = { ...defaultOptions, skipPackageJson: true };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/data']).toBeUndefined();
  });

  it('should import into a specified module', async () => {
    const options = { ...defaultOptions, module: 'app-module.ts' };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app-module.ts`);
    expect(content).toMatch(/import { EntityDataModule } from '@ngrx\/data'/);
  });

  it('should fail if specified module does not exist', async () => {
    const options = {
      ...defaultOptions,
      module: `${projectPath}/src/app/app-moduleXXX.ts`,
    };
    let thrownError: Error | null = null;
    try {
      await schematicRunner.runSchematic('data', options, appTree);
    } catch (err: any) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should add entity-metadata config to EntityDataModule', async () => {
    const options = { ...defaultOptions, effects: false, entityConfig: true };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app-module.ts`);
    expect(content).toMatch(
      /import { entityConfig } from '.\/entity-metadata'/
    );
    expect(content).toMatch(
      /EntityDataModuleWithoutEffects.forRoot\(entityConfig\)/
    );
  });

  it('should add entity-metadata config file', async () => {
    const options = { ...defaultOptions, entityConfig: true };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/entity-metadata.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should add entity-metadata config to EntityDataModule', async () => {
    const options = { ...defaultOptions, entityConfig: true };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app-module.ts`);
    expect(content).toMatch(
      /import { entityConfig } from '.\/entity-metadata'/
    );
    expect(content).toMatch(/EntityDataModule.forRoot\(entityConfig\)/);
  });

  it('should import EntityDataModuleWithoutEffects into a specified module', async () => {
    const options = {
      ...defaultOptions,
      module: 'app-module.ts',
      effects: false,
      entityConfig: false,
    };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app-module.ts`);
    expect(content).toMatch(
      /import { EntityDataModuleWithoutEffects } from '@ngrx\/data'/
    );
  });

  it('should register EntityDataModule in the provided module', async () => {
    const options = { ...defaultOptions, entityConfig: false };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app-module.ts`);
    expect(content).toMatch(/EntityDataModule/);
  });

  it('should register EntityDataModuleWithoutEffects in the provided module', async () => {
    const options = { ...defaultOptions, effects: false, entityConfig: false };

    const tree = await schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app-module.ts`);
    expect(content).toMatch(/EntityDataModuleWithoutEffects/);
  });

  describe('Migration of ngrx-data', () => {
    it('should remove ngrx-data from package.json', async () => {
      const options = { ...defaultOptions, migrateNgrxData: true };

      const packageJsonBefore = JSON.parse(
        appTree.readContent('/package.json')
      );
      packageJsonBefore['dependencies']['ngrx-data'] = '1.0.0';
      appTree.overwrite(
        '/package.json',
        JSON.stringify(packageJsonBefore, null, 2)
      );

      expect(
        JSON.parse(appTree.readContent('/package.json'))['dependencies'][
          'ngrx-data'
        ]
      ).toBeDefined();

      const tree = await schematicRunner.runSchematic(
        'ng-add',
        options,
        appTree
      );
      const packageJson = JSON.parse(tree.readContent('/package.json'));

      expect(packageJson.dependencies['ngrx-data']).not.toBeDefined();
    });

    it('should rename NgrxDataModule', async () => {
      const options = {
        ...defaultOptions,
        migrateNgrxData: true,
      };

      const dataModulePath = '/data.module.ts';

      const input = `
        import {
          DefaultDataServiceConfig,
          EntityDataService,
          EntityHttpResourceUrls,
          EntityServices,
          Logger,
          NgrxDataModule,
          Pluralizer
        } from 'ngrx-data';

        @NgModule({
          imports: [
            NgrxDataModule.forRoot({
              entityMetadata: entityMetadata,
              pluralNames: pluralNames
            })
          ],
        })
        export class AppModule {}
      `;

      const output = `
        import {
          DefaultDataServiceConfig,
          EntityDataService,
          EntityHttpResourceUrls,
          EntityServices,
          Logger,
          EntityDataModule,
          Pluralizer
        } from '@ngrx/data';

        @NgModule({
          imports: [
            EntityDataModule.forRoot({
              entityMetadata: entityMetadata,
              pluralNames: pluralNames
            })
          ],
        })
        export class AppModule {}
      `;
      appTree.create(dataModulePath, input);

      const tree = await schematicRunner.runSchematic(
        'ng-add',
        options,
        appTree
      );
      const actual = tree.readContent(dataModulePath);

      expect(actual).toBe(output);
    });

    it('should rename NgrxDataModuleWithoutEffects ', async () => {
      const options = {
        ...defaultOptions,
        migrateNgrxData: true,
      };

      const dataModulePath = '/data.module.ts';

      const input = `
        import {
          DefaultDataServiceConfig,
          EntityDataService,
          EntityHttpResourceUrls,
          EntityServices,
          Logger,
          NgrxDataModuleWithoutEffects,
          Pluralizer
        } from 'ngrx-data';

        @NgModule({
          imports: [
            NgrxDataModuleWithoutEffects.forRoot({
              entityMetadata: entityMetadata,
              pluralNames: pluralNames
            })
          ],
        })
        export class AppModule {}
      `;

      const output = `
        import {
          DefaultDataServiceConfig,
          EntityDataService,
          EntityHttpResourceUrls,
          EntityServices,
          Logger,
          EntityDataModuleWithoutEffects,
          Pluralizer
        } from '@ngrx/data';

        @NgModule({
          imports: [
            EntityDataModuleWithoutEffects.forRoot({
              entityMetadata: entityMetadata,
              pluralNames: pluralNames
            })
          ],
        })
        export class AppModule {}
      `;
      appTree.create(dataModulePath, input);

      const tree = await schematicRunner.runSchematic(
        'ng-add',
        options,
        appTree
      );
      const actual = tree.readContent(dataModulePath);

      expect(actual).toBe(output);
    });

    it('should rename NgrxDataModuleConfig ', async () => {
      const options = {
        ...defaultOptions,
        migrateNgrxData: true,
      };

      const dataModulePath = '/data.module.ts';

      const input = `
        import {
          DefaultDataServiceConfig,
          EntityDataService,
          EntityHttpResourceUrls,
          EntityServices,
          Logger,
          NgrxDataModule,
          NgrxDataModuleConfig,
          Pluralizer
        } from 'ngrx-data';

        const customConfig: NgrxDataModuleConfig = {
          root: 'api', // default root path to the server's web api
          timeout: 3000, // request timeout
        };

        @NgModule({
          imports: [
            NgrxDataModule.forRoot({
              entityMetadata: entityMetadata,
              pluralNames: pluralNames
            })
          ],
          providers: [
            { provide: DefaultDataServiceConfig, useValue: customConfig },
          ]
        })
        export class AppModule {}
      `;

      const output = `
        import {
          DefaultDataServiceConfig,
          EntityDataService,
          EntityHttpResourceUrls,
          EntityServices,
          Logger,
          EntityDataModule,
          EntityDataModuleConfig,
          Pluralizer
        } from '@ngrx/data';

        const customConfig: EntityDataModuleConfig = {
          root: 'api', // default root path to the server's web api
          timeout: 3000, // request timeout
        };

        @NgModule({
          imports: [
            EntityDataModule.forRoot({
              entityMetadata: entityMetadata,
              pluralNames: pluralNames
            })
          ],
          providers: [
            { provide: DefaultDataServiceConfig, useValue: customConfig },
          ]
        })
        export class AppModule {}
      `;
      appTree.create(dataModulePath, input);

      const tree = await schematicRunner.runSchematic(
        'ng-add',
        options,
        appTree
      );
      const actual = tree.readContent(dataModulePath);

      expect(actual).toBe(output);
    });

    describe('Data ng-add Schematic for standalone application', () => {
      const projectPath = getTestProjectPath(undefined, {
        name: 'bar-standalone',
      });

      const standaloneDefaultOptions = {
        ...defaultOptions,
        project: 'bar-standalone',
      };

      it('provides default data setup', async () => {
        const options = { ...standaloneDefaultOptions };
        const tree = await schematicRunner.runSchematic(
          'ng-add',
          options,
          appTree
        );

        const content = tree.readContent(
          `${projectPath}/src/app/app.config.ts`
        );

        expect(content).toMatchSnapshot();
      });

      it('provides data without effects', async () => {
        const options = { ...standaloneDefaultOptions, effects: false };
        const tree = await schematicRunner.runSchematic(
          'ng-add',
          options,
          appTree
        );

        const content = tree.readContent(
          `${projectPath}/src/app/app.config.ts`
        );

        expect(content).toMatchSnapshot();
      });

      it('provides data without entityConfig', async () => {
        const options = { ...standaloneDefaultOptions, entityConfig: false };
        const tree = await schematicRunner.runSchematic(
          'ng-add',
          options,
          appTree
        );

        const content = tree.readContent(
          `${projectPath}/src/app/app.config.ts`
        );

        expect(content).toMatchSnapshot();
      });
    });
  });
});
