import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createWorkspace } from '@ngrx/schematics-core/testing';

describe('NgrxPush migration', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  describe('migrateToNgrxPush', () => {
    const TEMPLATE = `
    <span>promise|async</span> <!-- this will also get replaced -->
    <span>One whitespace {{ greeting | async }}</span>
    <span>No whitespace {{ greeting |async }}</span>
    <span>Multiple whitespace {{ greeting |      async }}</span>
  `;

    it('should replace an inline template', async () => {
      appTree.create(
        './sut.component.ts',
        `@Component({
        selector: 'sut',
        template: \`${TEMPLATE}\`
      })
      export class SUTComponent { }`
      );

      const tree = await schematicRunner
        .runSchematicAsync('ngrx-push-migration', {}, appTree)
        .toPromise();

      const actual = tree.readContent('./sut.component.ts');
      expect(actual).not.toContain('async');
      expect(actual).toContain('ngrxPush');
    });

    it('should replace a file template', async () => {
      appTree.create(
        './sut.component.ts',
        `@Component({
        selector: 'sut',
        templateUrl: './sut.component.html'
      })
      export class SUTComponent { }`
      );
      appTree.create('./sut.component.html', TEMPLATE);

      const tree = await schematicRunner
        .runSchematicAsync('ngrx-push-migration', {}, appTree)
        .toPromise();

      const actual = tree.readContent('./sut.component.html');
      expect(actual).not.toContain('async');
      expect(actual).toContain('ngrxPush');
    });

    it('should not touch templates that are not referenced', async () => {
      appTree.create('./sut.component.html', TEMPLATE);

      const tree = await schematicRunner
        .runSchematicAsync('ngrx-push-migration', {}, appTree)
        .toPromise();

      const actual = tree.readContent('./sut.component.html');
      expect(actual).toBe(TEMPLATE);
    });
  });

  describe('importPushModule', () => {
    it('should import PushModule when BrowserModule is imported', async () => {
      appTree.create(
        './sut.module.ts',
        `
          import { BrowserModule } from '@angular/platform-browser';
          import { NgModule } from '@angular/core';

          import { AppComponent } from './app.component';

          @NgModule({
            declarations: [ AppComponent ],
            imports: [ BrowserModule ],
            providers: [],
            bootstrap: [AppComponent]
          })
          export class AppModule { }
      `
      );
      const tree = await schematicRunner
        .runSchematicAsync('ngrx-push-migration', {}, appTree)
        .toPromise();

      const actual = tree.readContent('./sut.module.ts');
      expect(actual).toMatch(/imports: \[ BrowserModule, PushModule \],/);
      expect(actual).toMatch(/import { PushModule } from '@ngrx\/component'/);
    });

    it('should import PushModule when CommonModule is imported', async () => {
      appTree.create(
        './sut.module.ts',
        `
          import { CommonModule } from '@angular/common';
          import { NgModule } from '@angular/core';

          import { AppComponent } from './app.component';

          @NgModule({
            declarations: [ AppComponent ],
            imports: [ CommonModule ],
            providers: [],
            bootstrap: [AppComponent]
          })
          export class AppModule { }
      `
      );
      const tree = await schematicRunner
        .runSchematicAsync('ngrx-push-migration', {}, appTree)
        .toPromise();

      const actual = tree.readContent('./sut.module.ts');
      expect(actual).toMatch(/imports: \[ CommonModule, PushModule \],/);
      expect(actual).toMatch(/import { PushModule } from '@ngrx\/component'/);
    });

    it("should not import PushModule when it doesn't need to", async () => {
      appTree.create(
        './sut.module.ts',
        `
          import { AppComponent } from './app.component';

          @NgModule({
            declarations: [ AppComponent ],
            imports: [],
            providers: [],
          })
          export class AppModule { }
      `
      );
      const tree = await schematicRunner
        .runSchematicAsync('ngrx-push-migration', {}, appTree)
        .toPromise();

      const actual = tree.readContent('./sut.module.ts');
      expect(actual).not.toMatch(/imports: \[ CommonModule, PushModule \],/);
      expect(actual).not.toMatch(
        /import { PushModule } from '@ngrx\/component'/
      );
    });
  });

  describe('exportPushModule', () => {
    it('should export PushModule when BrowserModule is exported', async () => {
      appTree.create(
        './sut.module.ts',
        `
          import { BrowserModule } from '@angular/platform-browser';
          import { NgModule } from '@angular/core';

          import { AppComponent } from './app.component';

          @NgModule({
            declarations: [ AppComponent ],
            exports: [ BrowserModule ],
            providers: [],
            bootstrap: [AppComponent]
          })
          export class AppModule { }
      `
      );
      const tree = await schematicRunner
        .runSchematicAsync('ngrx-push-migration', {}, appTree)
        .toPromise();

      const actual = tree.readContent('./sut.module.ts');
      expect(actual).toMatch(/exports: \[ BrowserModule, PushModule \],/);
      expect(actual).toMatch(/import { PushModule } from '@ngrx\/component'/);
    });

    it('should export PushModule when CommonModule is exported', async () => {
      appTree.create(
        './sut.module.ts',
        `
          import { CommonModule } from '@angular/common';
          import { NgModule } from '@angular/core';

          import { AppComponent } from './app.component';

          @NgModule({
            declarations: [ AppComponent ],
            exports: [ CommonModule ],
            providers: [],
            bootstrap: [AppComponent]
          })
          export class AppModule { }
      `
      );
      const tree = await schematicRunner
        .runSchematicAsync('ngrx-push-migration', {}, appTree)
        .toPromise();

      const actual = tree.readContent('./sut.module.ts');
      expect(actual).toMatch(/exports: \[ CommonModule, PushModule \],/);
      expect(actual).toMatch(/import { PushModule } from '@ngrx\/component'/);
    });

    it("should not export PushModule when it doesn't need to", async () => {
      appTree.create(
        './sut.module.ts',
        `
          import { AppComponent } from './app.component';

          @NgModule({
            declarations: [ AppComponent ],
            exports: [],
            providers: [],
          })
          export class AppModule { }
      `
      );
      const tree = await schematicRunner
        .runSchematicAsync('ngrx-push-migration', {}, appTree)
        .toPromise();

      const actual = tree.readContent('./sut.module.ts');
      expect(actual).not.toMatch(/exports: \[ CommonModule, PushModule \],/);
      expect(actual).not.toMatch(
        /import { PushModule } from '@ngrx\/component'/
      );
    });
  });
});
