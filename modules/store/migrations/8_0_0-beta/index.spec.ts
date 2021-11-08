import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createPackageJson } from '@ngrx/schematics-core/testing/create-package';

describe('Store Migration 8_0_0 beta', () => {
  let appTree: UnitTestTree;
  const collectionPath = path.join(__dirname, '../migration.json');
  const pkgName = 'store';
  beforeEach(() => {
    appTree = new UnitTestTree(Tree.empty());
    appTree.create(
      '/tsconfig.json',
      `
        {
          "include": [**./*.ts"]
        }
       `
    );
    createPackageJson('', pkgName, appTree);
  });

  it(`should replace the meta reducer imports`, async () => {
    const contents = `
      import {
        RuntimeChecks,
        META_REDUCERS,
        Store,
        META_REDUCERS,
        StoreModule,
        META_REDUCERS as foo,
      } from '@ngrx/store';`;
    const expected = `
      import {
        RuntimeChecks,
        USER_PROVIDED_META_REDUCERS,
        Store,
        USER_PROVIDED_META_REDUCERS,
        StoreModule,
        USER_PROVIDED_META_REDUCERS as foo,
      } from '@ngrx/store';`;

    appTree.create('./app.module.ts', contents);
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const newTree = await runner
      .runSchematicAsync(`ngrx-${pkgName}-migration-02`, {}, appTree)
      .toPromise();
    const file = newTree.readContent('app.module.ts');

    expect(file).toBe(expected);
  });

  it(`should replace the meta reducer assignments`, async () => {
    const contents = `
      @NgModule({
        imports: [
          CommonModule,
          BrowserModule,
          BrowserAnimationsModule,
          HttpClientModule,
          AuthModule,
          AppRoutingModule,
          StoreModule.forRoot(reducers),
        ],
        providers: [
          {
            provide: META_REDUCERS,
            useValue: [fooReducer, barReducer]
          }
        ]
        bootstrap: [AppComponent],
      })
      export class AppModule {}`;
    const expected = `
      @NgModule({
        imports: [
          CommonModule,
          BrowserModule,
          BrowserAnimationsModule,
          HttpClientModule,
          AuthModule,
          AppRoutingModule,
          StoreModule.forRoot(reducers),
        ],
        providers: [
          {
            provide: USER_PROVIDED_META_REDUCERS,
            useValue: [fooReducer, barReducer]
          }
        ]
        bootstrap: [AppComponent],
      })
      export class AppModule {}`;

    appTree.create('./app.module.ts', contents);
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const newTree = await runner
      .runSchematicAsync(`ngrx-${pkgName}-migration-02`, {}, appTree)
      .toPromise();
    const file = newTree.readContent('app.module.ts');

    expect(file).toBe(expected);
  });

  it(`should not run schematics when not using named imports`, async () => {
    const contents = `
      import * as store from '@ngrx/store';

      @NgModule({
        imports: [
          CommonModule,
          BrowserModule,
          BrowserAnimationsModule,
          HttpClientModule,
          AuthModule,
          AppRoutingModule,
          store.StoreModule.forRoot(reducers),
        ],
        providers: [
          {
            provide: store.META_REDUCERS,
            useValue: [fooReducer, barReducer]
          }
        ]
        bootstrap: [AppComponent],
      })
      export class AppModule {}
    `;

    appTree.create('./app.module.ts', contents);
    const runner = new SchematicTestRunner('schematics', collectionPath);

    const logs: string[] = [];
    runner.logger.subscribe((log) => logs.push(log.message));

    const newTree = await runner
      .runSchematicAsync(`ngrx-${pkgName}-migration-02`, {}, appTree)
      .toPromise();
    const file = newTree.readContent('app.module.ts');

    expect(file).toBe(contents);

    expect(logs.length).toBe(1);
    expect(logs[0]).toMatch(/NgRx 8 Migration: Unable to run the schematics/);
  });
});
