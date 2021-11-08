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
    module: 'app',
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should update package.json', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/data']).toBeDefined();
  });

  it('should skip package.json update', async () => {
    const options = { ...defaultOptions, skipPackageJson: true };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/data']).toBeUndefined();
  });

  it('should import into a specified module', async () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(/import { EntityDataModule } from '@ngrx\/data'/);
  });

  it('should fail if specified module does not exist', async () => {
    const options = {
      ...defaultOptions,
      module: `${projectPath}/src/app/app.moduleXXX.ts`,
    };
    let thrownError: Error | null = null;
    try {
      await schematicRunner.runSchematicAsync('data', options, appTree);
    } catch (err: any) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should add entity-metadata config to EntityDataModule', async () => {
    const options = { ...defaultOptions, effects: false, entityConfig: true };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { entityConfig } from '.\/entity-metadata'/
    );
    expect(content).toMatch(
      /EntityDataModuleWithoutEffects.forRoot\(entityConfig\)/
    );
  });

  it('should add entity-metadata config file', async () => {
    const options = { ...defaultOptions, entityConfig: true };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    expect(
      tree.files.indexOf(`${projectPath}/src/app/entity-metadata.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should add entity-metadata config to EntityDataModule', async () => {
    const options = { ...defaultOptions, entityConfig: true };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { entityConfig } from '.\/entity-metadata'/
    );
    expect(content).toMatch(/EntityDataModule.forRoot\(entityConfig\)/);
  });

  it('should import EntityDataModuleWithoutEffects into a specified module', async () => {
    const options = {
      ...defaultOptions,
      module: 'app.module.ts',
      effects: false,
      entityConfig: false,
    };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { EntityDataModuleWithoutEffects } from '@ngrx\/data'/
    );
  });

  it('should register EntityDataModule in the provided module', async () => {
    const options = { ...defaultOptions, entityConfig: false };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(/EntityDataModule\n/);
  });

  it('should register EntityDataModuleWithoutEffects in the provided module', async () => {
    const options = { ...defaultOptions, effects: false, entityConfig: false };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(/EntityDataModuleWithoutEffects\n/);
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

      const tree = await schematicRunner
        .runSchematicAsync('ng-add', options, appTree)
        .toPromise();
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

      const tree = await schematicRunner
        .runSchematicAsync('ng-add', options, appTree)
        .toPromise();
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

      const tree = await schematicRunner
        .runSchematicAsync('ng-add', options, appTree)
        .toPromise();
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

      const tree = await schematicRunner
        .runSchematicAsync('ng-add', options, appTree)
        .toPromise();
      const actual = tree.readContent(dataModulePath);

      expect(actual).toBe(output);
    });
  });
});
