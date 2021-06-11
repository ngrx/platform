import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  ReplaceChange,
  createReplaceChange,
  visitTSSourceFiles,
  commitChanges,
} from '../../schematics-core';

function updateRouterStoreImport(): Rule {
  return (tree: Tree) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const changes: ReplaceChange[] = [];
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
              .filter(
                (element) => element.text === 'StoreRouterConnectingModule'
              )
              .forEach((element) => {
                changes.push(
                  createReplaceChange(
                    sourceFile,
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

      commitChanges(tree, sourceFile.fileName, changes);
    });
  };
}

export default function (): Rule {
  return chain([updateRouterStoreImport()]);
}
