import * as ts from 'typescript';
import { Tree } from '@angular-devkit/schematics';
import { findBootstrapApplicationCall } from '@schematics/angular/private/standalone';

export function isStandaloneApp(host: Tree, mainPath: string): boolean {
  const source = ts.createSourceFile(
    mainPath,
    host.readText(mainPath),
    ts.ScriptTarget.Latest,
    true
  );
  const bootstrapCall = findBootstrapApplicationCall(source);

  return bootstrapCall !== null;
}
