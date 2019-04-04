import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  ReplaceChange,
  createChangeRecorder,
  createReplaceChange,
} from '@ngrx/router-store/schematics-core';

function updateRouterStoreImport(): Rule {
  return (tree: Tree) => {
    tree.visit(path => {
      if (!path.endsWith('.ts')) {
        return;
      }

      const sourceFile = ts.createSourceFile(
        path,
        tree.read(path)!.toString(),
        ts.ScriptTarget.Latest
      );

      if (sourceFile.isDeclarationFile) {
        return;
      }
      let changes: ReplaceChange[] = [];
      ts.forEachChild(sourceFile, function findDecorator(node) {
        if (!ts.isDecorator(node)) {
          ts.forEachChild(node, findDecorator);
          return;
        }

        ts.forEachChild(node, function findImports(node) {
          if (
            ts.isPropertyAssignment(node) &&
            ts.isArrayLiteralExpression(node.initializer) &&
            ts.isIdentifier(node.name) &&
            node.name.text === 'imports'
          ) {
            node.initializer.elements
              .filter(ts.isIdentifier)
              .filter(element => element.text === 'StoreRouterConnectingModule')
              .forEach(element => {
                changes.push(
                  createReplaceChange(
                    sourceFile,
                    path,
                    element,
                    'StoreRouterConnectingModule',
                    'StoreRouterConnectingModule.forRoot()'
                  )
                );
              });
          }

          ts.forEachChild(node, findImports);
        });
      });

      if (changes.length < 1) {
        return;
      }

      const recorder = createChangeRecorder(tree, path, changes);
      tree.commitUpdate(recorder);
    });
  };
}

export default function(): Rule {
  return chain([updateRouterStoreImport()]);
}
