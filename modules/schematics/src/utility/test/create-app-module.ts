import { Tree } from '@angular-devkit/schematics';

export function createAppModule(tree: Tree, path?: string): Tree {
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
