import {
  Change,
  createReplaceChange,
  visitTSSourceFiles,
} from '../../schematics-core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { commitChanges } from '../../schematics-core';

export default function migrateWritableStateSource(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const signalStoreImportedName = findImportedName(sourceFile);
      if (!signalStoreImportedName) {
        return;
      }

      const changes: Change[] = [];
      visitCallExpression(sourceFile, signalStoreImportedName, (node) => {
        if (node.arguments.length > 0) {
          if (ts.isObjectLiteralExpression(node.arguments[0])) {
            // signalStore({ providedIn: 'root' })
            const providedInProperty = node.arguments[0].properties[0];

            if (
              ts.isPropertyAssignment(providedInProperty) &&
              ts.isIdentifier(providedInProperty.name) &&
              providedInProperty.name.text === 'providedIn'
            ) {
              changes.push(
                createReplaceChange(
                  sourceFile,
                  providedInProperty,
                  providedInProperty.getText(),
                  `${providedInProperty.getText()}, protectedState: false`
                )
              );
            }
          } else {
            // signalStore(withState({}))
            const firstFeature = node.arguments[0];
            changes.push(
              createReplaceChange(
                sourceFile,
                firstFeature,
                firstFeature.getText(),
                `{ protectedState: false }, ${firstFeature.getText()}`
              )
            );
          }
        } else {
          // signalStore()
          changes.push(
            createReplaceChange(
              sourceFile,
              node,
              node.getText(),
              `${signalStoreImportedName}({ protectedState: false })`
            )
          );
        }
      });

      if (changes.length) {
        commitChanges(tree, sourceFile.fileName, changes);
        ctx.logger.info(
          `[@ngrx/signals] Disable protected state in ${sourceFile.fileName}`
        );
      }
    });
  };
}

function visitCallExpression(
  node: ts.Node,
  name: string,
  callback: (callExpression: ts.CallExpression) => void
) {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === name
  ) {
    callback(node);
  }

  ts.forEachChild(node, (child) => {
    visitCallExpression(child, name, callback);
  });
}

function visitImportDeclaration(
  node: ts.Node,
  callback: (importDeclaration: ts.ImportDeclaration) => void
) {
  if (ts.isImportDeclaration(node)) {
    callback(node);
  }

  ts.forEachChild(node, (child) => {
    visitImportDeclaration(child, callback);
  });
}

function findImportedName(source: ts.SourceFile) {
  let importedName = '';
  visitImportDeclaration(source, (importDeclaration) => {
    if (importDeclaration.moduleSpecifier.getText().includes('@ngrx/signals')) {
      if (importedName) {
        return;
      }

      const namedBindings = importDeclaration.importClause?.namedBindings;
      if (namedBindings && ts.isNamedImports(namedBindings)) {
        const foundImportedName = namedBindings.elements
          .map((importSpecifier) => {
            if (
              importSpecifier.propertyName &&
              importSpecifier.propertyName.text === 'signalStore'
            ) {
              return importSpecifier.name.text;
            } else if (importSpecifier.name.text === 'signalStore') {
              return 'signalStore';
            }
            return undefined;
          })
          .find(Boolean);

        if (foundImportedName) {
          importedName = foundImportedName;
          return;
        }
      }
    }
  });

  return importedName;
}
