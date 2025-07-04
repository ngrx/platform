import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  createReplaceChange,
  commitChanges,
  Change,
} from '../../schematics-core/index';
import { visitCallExpression } from '@ngrx/schematics-core/utility/visitors';
import * as ts from 'typescript';

export default function migrateTapResponse(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile: ts.SourceFile) => {
      const changes: Change[] = [];
      const printer = ts.createPrinter();

      const tapResponseIdentifiers = new Set<string>();
      const namespaceImportsFromOperators = new Set<string>();
      const aliasedTapResponseVariables = new Set<string>();

      // Collect import origins and aliases
      ts.forEachChild(sourceFile, (node: ts.Node) => {
        if (
          ts.isImportDeclaration(node) &&
          ts.isStringLiteral(node.moduleSpecifier) &&
          node.moduleSpecifier.text === '@ngrx/operators' &&
          node.importClause?.namedBindings
        ) {
          const bindings = node.importClause.namedBindings;

          if (ts.isNamedImports(bindings)) {
            for (const element of bindings.elements) {
              tapResponseIdentifiers.add(element.name.text);
            }
          } else if (ts.isNamespaceImport(bindings)) {
            namespaceImportsFromOperators.add(bindings.name.text);
          }
        }

        // Track variables assigned to known tapResponse identifiers
        if (ts.isVariableStatement(node)) {
          for (const decl of node.declarationList.declarations) {
            if (
              ts.isIdentifier(decl.name) &&
              decl.initializer &&
              ts.isIdentifier(decl.initializer) &&
              tapResponseIdentifiers.has(decl.initializer.text)
            ) {
              aliasedTapResponseVariables.add(decl.name.text);
            }
          }
        }
      });

      // Combine aliases into the main set
      for (const alias of aliasedTapResponseVariables) {
        tapResponseIdentifiers.add(alias);
      }

      visitCallExpression(sourceFile, (node: ts.CallExpression) => {
        const { expression, arguments: args } = node;

        let isTapResponseCall = false;

        if (ts.isIdentifier(expression)) {
          if (tapResponseIdentifiers.has(expression.text)) {
            isTapResponseCall = true;
          }
        } else if (ts.isPropertyAccessExpression(expression)) {
          const namespace = expression.expression.getText();
          const fnName = expression.name.text;
          if (
            fnName === 'tapResponse' &&
            namespaceImportsFromOperators.has(namespace)
          ) {
            isTapResponseCall = true;
          }
        }

        if (
          isTapResponseCall &&
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

          const newCall = ts.factory.updateCallExpression(
            node,
            expression,
            node.typeArguments,
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
        context.logger.info(
          `[ngrx/operators] Migrated deprecated tapResponse in ${sourceFile.fileName}`
        );
      }
    });
  };
}
