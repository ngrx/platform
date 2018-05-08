import { UnitTestTree } from '@angular-devkit/schematics/testing';

export function createAppModule(
  tree: UnitTestTree,
  path?: string
): UnitTestTree {
  tree.create(
    path || '/src/app/app.module.ts',
    `
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { AppComponent } from './app.component';

    @NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
    })
    export class AppModule { }
  `
  );

  return tree;
}

export function createAppModuleWithEffects(
  tree: UnitTestTree,
  path: string,
  effects?: string
): UnitTestTree {
  tree.create(
    path || '/src/app/app.module.ts',
    `
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { AppComponent } from './app.component';
    import { EffectsModule } from '@ngrx/effects';

    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        ${effects}
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
  `
  );

  return tree;
}
