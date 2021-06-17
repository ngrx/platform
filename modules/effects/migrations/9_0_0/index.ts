import * as ts from 'typescript';
import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  commitChanges,
  visitTSSourceFiles,
  createReplaceChange,
  ReplaceChange,
} from '../../schematics-core';

function renameErrorHandlerConfig(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const changes: ReplaceChange[] = replaceEffectConfigKeys(
        sourceFile,
        'resubscribeOnError',
        'useEffectsErrorHandler'
      );

      commitChanges(tree, sourceFile.fileName, changes);

      if (changes.length) {
        ctx.logger.info(
          `[@ngrx/effects] Updated Effects configuration, see the migration guide (https://ngrx.io/guide/migration/v9#effects) for more info`
        );
      }
    });
  };
}

function replaceEffectConfigKeys(
  sourceFile: ts.SourceFile,
  oldText: string,
  newText: string
): ReplaceChange[] {
  const changes: ReplaceChange[] = [];

  ts.forEachChild(sourceFile, (node) => {
    visitCreateEffectFunctionCreator(node, (createEffectNode) => {
      const [effectDeclaration, configNode] = createEffectNode.arguments;
      if (configNode) {
        findAndReplaceText(configNode);
      }
    });

    visitEffectDecorator(node, (effectDecoratorNode) => {
      findAndReplaceText(effectDecoratorNode);
    });
  });

  return changes;

  function findAndReplaceText(node: ts.Node): void {
    visitIdentifierWithText(node, oldText, (match) => {
      changes.push(createReplaceChange(sourceFile, match, oldText, newText));
    });
  }
}

function visitIdentifierWithText(
  node: ts.Node,
  text: string,
  visitor: (node: ts.Node) => void
) {
  if (ts.isIdentifier(node) && node.text === text) {
    visitor(node);
  }

  ts.forEachChild(node, (childNode) =>
    visitIdentifierWithText(childNode, text, visitor)
  );
}

function visitEffectDecorator(node: ts.Node, visitor: (node: ts.Node) => void) {
  if (
    ts.isDecorator(node) &&
    ts.isCallExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    node.expression.expression.text === 'Effect'
  ) {
    visitor(node);
  }

  ts.forEachChild(node, (childNode) =>
    visitEffectDecorator(childNode, visitor)
  );
}

function visitCreateEffectFunctionCreator(
  node: ts.Node,
  visitor: (node: ts.CallExpression) => void
) {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'createEffect'
  ) {
    visitor(node);
  }

  ts.forEachChild(node, (childNode) =>
    visitCreateEffectFunctionCreator(childNode, visitor)
  );
}

export default function (): Rule {
  return chain([renameErrorHandlerConfig()]);
}
