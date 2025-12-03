import {
  Change,
  commitChanges,
  createReplaceChange,
  findNodes,
  visitTSSourceFiles,
} from '../../schematics-core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

const EVENTS_PKG = '@ngrx/signals/events';
const OLD_NAME = 'withEffects';
const NEW_NAME = 'withEventHandlers';

export default function migrateWithEventHandlers(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const changes: Change[] = [];
      const namespaceImports = new Set<string>();

      const directImports = new Set<string>();

      const importDeclarations = findNodes(
        sourceFile,
        ts.SyntaxKind.ImportDeclaration
      ) as ts.ImportDeclaration[];

      for (const decl of importDeclarations) {
        const moduleSpecifier = decl.moduleSpecifier as ts.StringLiteral;
        if (!moduleSpecifier || moduleSpecifier.text !== EVENTS_PKG) {
          continue;
        }

        const importClause = decl.importClause;
        if (!importClause || !importClause.namedBindings) {
          continue;
        }

        if (ts.isNamedImports(importClause.namedBindings)) {
          const named = importClause.namedBindings;

          named.elements.forEach((spec) => {
            const importedName = spec.propertyName ?? spec.name;
            const localName = spec.name;
            const hasAlias = spec.propertyName !== undefined;

            if (importedName.text === OLD_NAME) {
              changes.push(
                createReplaceChange(
                  sourceFile,
                  importedName,
                  importedName.getText(),
                  NEW_NAME
                )
              );

              if (!hasAlias) {
                directImports.add(localName.text);
              }
            }
          });
        }

        if (ts.isNamespaceImport(importClause.namedBindings)) {
          namespaceImports.add(importClause.namedBindings.name.text);
        }
      }

      if (directImports.size > 0) {
        const callExpressions = findNodes(
          sourceFile,
          ts.SyntaxKind.CallExpression
        ) as ts.CallExpression[];

        callExpressions.forEach((call) => {
          if (
            ts.isIdentifier(call.expression) &&
            directImports.has(call.expression.text)
          ) {
            changes.push(
              createReplaceChange(
                sourceFile,
                call.expression,
                call.expression.getText(),
                NEW_NAME
              )
            );
          }
        });
      }

      if (namespaceImports.size > 0) {
        const propertyAccesses = findNodes(
          sourceFile,
          ts.SyntaxKind.PropertyAccessExpression
        ) as ts.PropertyAccessExpression[];

        propertyAccesses.forEach((pa) => {
          if (
            ts.isIdentifier(pa.expression) &&
            namespaceImports.has(pa.expression.text) &&
            ts.isIdentifier(pa.name) &&
            pa.name.text === OLD_NAME
          ) {
            changes.push(
              createReplaceChange(
                sourceFile,
                pa.name,
                pa.name.getText(),
                NEW_NAME
              )
            );
          }
        });
      }

      if (changes.length) {
        commitChanges(tree, sourceFile.fileName, changes);
        ctx.logger.info(
          `[@ngrx/signals] Renamed '${OLD_NAME}' to '${NEW_NAME}' in /${sourceFile.fileName}`
        );
      }
    });
  };
}
