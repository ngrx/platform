import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  createReplaceChange,
  commitChanges,
  Change,
} from '@ngrx/component/schematics-core';
import { visitCallExpression } from '@ngrx/schematics-core/utility/visitors';
import * as ts from 'typescript';

export default function migrateTapResponse(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const changes: Change[] = [];
      const visited = new Set<number>();
      const tapResponseIdentifiers = new Set(['tapResponse']);

      // Track aliases like: const myTapResponse = tapResponse;
      ts.forEachChild(sourceFile, (node) => {
        if (ts.isVariableStatement(node)) {
          node.declarationList.declarations.forEach((decl) => {
            if (
              ts.isIdentifier(decl.name) &&
              decl.initializer &&
              ts.isIdentifier(decl.initializer) &&
              decl.initializer.text === 'tapResponse'
            ) {
              tapResponseIdentifiers.add(decl.name.text);
            }
          });
        }
      });

      const printer = ts.createPrinter();

      visitCallExpression(sourceFile, (node) => {
        const { expression, arguments: args } = node;

        // Avoid duplicates by tracking position
        if (visited.has(node.getStart())) return;
        visited.add(node.getStart());

        let fnName = '';
        if (ts.isIdentifier(expression)) {
          fnName = expression.text;
        } else if (ts.isPropertyAccessExpression(expression)) {
          fnName = expression.name.text;
        }

        if (
          tapResponseIdentifiers.has(fnName) &&
          (args.length === 2 || args.length === 3) &&
          args.every(
            (arg) => ts.isArrowFunction(arg) || ts.isFunctionExpression(arg)
          )
        ) {
          const props: ts.PropertyAssignment[] = [
            ts.factory.createPropertyAssignment('next', args[0]),
            ts.factory.createPropertyAssignment('error', args[1]),
          ];

          if (args[2]) {
            props.push(
              ts.factory.createPropertyAssignment('complete', args[2])
            );
          }

          const newCall = ts.factory.createCallExpression(
            expression,
            undefined,
            [ts.factory.createObjectLiteralExpression(props, true)]
          );

          const newText = printer.printNode(
            ts.EmitHint.Expression,
            newCall,
            sourceFile
          );

          changes.push(
            createReplaceChange(sourceFile, node, node.getText(), newText)
          );
        }
      });

      if (changes.length) {
        commitChanges(tree, sourceFile.fileName, changes);
        context.logger.debug(
          `[rxjs] Migrated deprecated tapResponse in ${sourceFile.fileName}`
        );
      }
    });
  };
}
