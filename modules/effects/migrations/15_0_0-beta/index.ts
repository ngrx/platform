import * as ts from 'typescript';
import {
  Tree,
  Rule,
  chain,
  SchematicContext,
} from '@angular-devkit/schematics';
import {
  commitChanges,
  createReplaceChange,
  ReplaceChange,
  visitTSSourceFiles,
} from '../../schematics-core';

export function migrateProvideEffects(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const changes: ReplaceChange[] = [];

      let isProvideEffectsImported = false;
      visitImportSpecifiers(sourceFile, (node) => {
        if (
          node.name.getText() === 'provideEffects' &&
          node.parent.parent.parent.moduleSpecifier
            .getText()
            .includes('@ngrx/effects')
        ) {
          isProvideEffectsImported = true;
          return;
        }
      });

      if (!isProvideEffectsImported) {
        return;
      }

      visitProvideEffects(sourceFile, (node) => {
        const [effectClasses] = node.arguments;
        if (effectClasses && ts.isArrayLiteralExpression(effectClasses)) {
          const spreaded = effectClasses.elements
            .map((e) => e.getText())
            .join(', ');
          changes.push(
            createReplaceChange(
              sourceFile,
              effectClasses,
              effectClasses.getText(),
              spreaded
            )
          );
        }
      });

      commitChanges(tree, sourceFile.fileName, changes);

      if (changes.length) {
        ctx.logger.info(`[@ngrx/effects] Updated provideEffects usage`);
      }
    });
  };
}

function visitProvideEffects(
  node: ts.Node,
  visitor: (node: ts.CallExpression) => void
) {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'provideEffects'
  ) {
    visitor(node);
  }

  ts.forEachChild(node, (childNode) => visitProvideEffects(childNode, visitor));
}

function visitImportSpecifiers(
  node: ts.Node,
  visitor: (node: ts.ImportSpecifier) => void
) {
  if (ts.isImportSpecifier(node)) {
    visitor(node);
  }

  ts.forEachChild(node, (childNode) =>
    visitImportSpecifiers(childNode, visitor)
  );
}

export default function (): Rule {
  return chain([migrateProvideEffects()]);
}
