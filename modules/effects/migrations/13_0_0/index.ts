import * as ts from 'typescript';
import { BinaryExpression } from 'typescript';
import { Path } from '@angular-devkit/core';
import { chain, Rule, Tree } from '@angular-devkit/schematics';
import {
  Change,
  commitChanges,
  createReplaceChange,
  replaceImport,
  visitTSSourceFiles,
} from '../../schematics-core';
import { createRemoveChange } from '../../schematics-core/utility/change';

export function migrateToCreators(): Rule {
  interface EffectDeclaration {
    name: string;
    propertyDeclaration: ts.PropertyDeclaration;
    decoratorNode: ts.Decorator;
    decoratorConfig?: string;
    handled: boolean;
  }

  return (tree: Tree) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const classChanges: Change[] = sourceFile.statements
        .filter(ts.isClassDeclaration)
        .reduce<Change[]>((accChanges, clas) => {
          // find effect declarations
          const effectDeclarations: EffectDeclaration[] = clas.members
            .filter(ts.isPropertyDeclaration)
            .filter(
              (property) =>
                ts.isIdentifier(property.name) &&
                // && (property.decorators || []).some(isEffectDecorator) // deprecated
                (ts.getDecorators(property) || []).some(isEffectDecorator)
            )
            .map((property) => {
              // const decorator = (property.decorators || []).find(isEffectDecorator) as ts.Decorator;
              const decorator = (ts.getDecorators(property) || []).find(
                isEffectDecorator
              ) as ts.Decorator;

              // gather all relevant info
              return <EffectDeclaration>{
                name: (property.name as ts.Identifier).text,
                propertyDeclaration: property,
                decoratorNode: decorator,
                decoratorConfig: getDispatchProperties(decorator),
                handled: false,
              };
            });

          // find and handle declaration assignments
          effectDeclarations.forEach((effectDeclaration: EffectDeclaration) => {
            const initializer =
              effectDeclaration.propertyDeclaration.initializer;

            if (initializer) {
              const assignmentText = initializer?.getText();

              if (!assignmentText.includes('createEffect')) {
                const effectConfig: string = effectDeclaration.decoratorConfig
                  ? `, ${effectDeclaration.decoratorConfig}`
                  : '';
                accChanges.push(
                  createReplaceChange(
                    sourceFile,
                    initializer,
                    assignmentText,
                    `createEffect(() => ${assignmentText}${effectConfig})`
                  )
                );
              }

              effectDeclaration.handled = true;
            }
          });

          // find and handle constructor assignments
          const isDeclaredEffectIdentifier = (
            identifier: ts.Identifier
          ): EffectDeclaration | undefined => {
            return effectDeclarations.find(
              (propertyDeclaration: EffectDeclaration) => {
                return propertyDeclaration.name == identifier.text;
              }
            );
          };

          const isEffectAssignmentNode = (
            node: ts.Node
          ): EffectDeclaration | undefined => {
            if (!ts.isBinaryExpression(node)) {
              return void 0;
            }

            const binaryExpression: BinaryExpression = node as BinaryExpression;

            // operatorToken must be 'assignment' (equals-token)
            if (
              binaryExpression.operatorToken.kind !== ts.SyntaxKind.EqualsToken
            ) {
              return void 0;
            }

            if (ts.isIdentifier(binaryExpression.left)) {
              // identify simple assignment: foo$ = ...
              return isDeclaredEffectIdentifier(
                binaryExpression.left as ts.Identifier
              );
            } else if (ts.isPropertyAccessExpression(binaryExpression.left)) {
              // identify 'this' assignment: this.foo$ = ...
              return isDeclaredEffectIdentifier(
                (binaryExpression.left as ts.PropertyAccessExpression)
                  .name as ts.Identifier
              );
            }

            return void 0;
          };

          const checkEffectAssignmentNode = (node: ts.Node) => {
            const effectDeclaration = isEffectAssignmentNode(node);

            if (!effectDeclaration) {
              ts.forEachChild(node, checkEffectAssignmentNode);
            } else {
              const binaryExpression = node as BinaryExpression;

              const assignmentText = binaryExpression.right.getText();

              if (!assignmentText.includes('createEffect')) {
                const effectConfig: string = effectDeclaration.decoratorConfig
                  ? `, ${effectDeclaration.decoratorConfig}`
                  : '';
                accChanges.push(
                  createReplaceChange(
                    sourceFile,
                    binaryExpression.right,
                    assignmentText,
                    `createEffect(() => ${assignmentText}${effectConfig})`
                  )
                );
              }

              // mark effectDeclaration as handled
              effectDeclaration.handled = true;
            }
          };

          // find constructor & (deep) handle child nodes
          clas.members
            .filter(ts.isConstructorDeclaration)
            .forEach((constructorNode) => {
              ts.forEachChild(constructorNode, checkEffectAssignmentNode);
            });

          // remove @Effect from effectDeclarations (only if effectDeclaration.handled)
          effectDeclarations
            .filter((effectDeclaration) => effectDeclaration.handled)
            .forEach((effectDeclaration) => {
              const decoratorNode = effectDeclaration.decoratorNode;
              const trailingWhiteSpaces = getTrailingWhitespaces(decoratorNode);

              accChanges.push(
                createRemoveChange(
                  sourceFile,
                  decoratorNode,
                  decoratorNode.getStart(),
                  decoratorNode.getEnd() + trailingWhiteSpaces.length
                )
              );
            });

          return accChanges;
        }, []);

      const importChanges = replaceImport(
        sourceFile,
        sourceFile.fileName as Path,
        '@ngrx/effects',
        'Effect',
        'createEffect'
      );

      commitChanges(tree, sourceFile.fileName, [
        ...importChanges,
        ...classChanges,
      ]);
    });
  };
}

function isEffectDecorator({ expression }: ts.Decorator): boolean {
  return (
    ts.isCallExpression(expression) &&
    ts.isIdentifier(expression.expression) &&
    expression.expression.text === 'Effect'
  );
}

function getTrailingWhitespaces(node: ts.Node) {
  const regExpMatchArray = node
    .getSourceFile()
    .getFullText()
    .substring(node.getEnd())
    .match(/(\s*)/);
  if (!!regExpMatchArray && regExpMatchArray.index === 0) {
    return regExpMatchArray[1];
  }
  return '';
}

function getDispatchProperties(decorator: ts.Decorator) {
  if (!decorator.expression || !ts.isCallExpression(decorator.expression)) {
    return void 0;
  }

  // just copy the effect properties
  return decorator
    .getSourceFile()
    .getFullText()
    .substring(
      decorator.expression.arguments.pos,
      decorator.expression.arguments.end
    )
    .trim();
}

export default function (): Rule {
  return chain([migrateToCreators()]);
}
