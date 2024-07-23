import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  isArrowFunctionExpression,
  isCallExpression,
  isFunctionDeclaration,
  isIdentifier,
} from '../../utils';

export const messageId = 'signalStoreFeatureShouldUseGenericType';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    ngrxModule: 'signals',
    docs: {
      description: `A custom Signal Store feature that accepts an input should define a generic type.`,
    },
    schema: [],
    messages: {
      [messageId]: `Add an unused generic type to the function creating the signal store feature.`,
    },
  },
  defaultOptions: [],
  create: (context) => {
    function report(
      signalStoreFeature: TSESTree.CallExpression,
      func?: TSESTree.Node
    ) {
      if (
        !func ||
        (!isFunctionDeclaration(func) && !isArrowFunctionExpression(func))
      ) {
        return;
      }
      const parentHasGenerics =
        func.typeParameters && func.typeParameters.params.length > 0;
      if (!parentHasGenerics) {
        context.report({
          node: signalStoreFeature.callee,
          messageId,
        });
      }
    }

    function hasInputAsArgument(node: TSESTree.CallExpression) {
      const [inputArg] = node.arguments;
      return (
        !isCallExpression(inputArg) ||
        (isIdentifier(inputArg.callee) && inputArg.callee.name === 'type')
      );
    }

    return {
      [`ArrowFunctionExpression > CallExpression[callee.name=signalStoreFeature]`](
        node: TSESTree.CallExpression
      ) {
        if (hasInputAsArgument(node)) {
          report(node, node.parent);
        }
      },
      [`ArrowFunctionExpression > BlockStatement CallExpression[callee.name=signalStoreFeature]`](
        node: TSESTree.CallExpression
      ) {
        if (hasInputAsArgument(node)) {
          let parent: TSESTree.Node | undefined = node.parent;
          while (parent && !isArrowFunctionExpression(parent)) {
            parent = parent.parent;
          }
          report(node, parent);
        }
      },
      [`FunctionDeclaration > BlockStatement CallExpression[callee.name=signalStoreFeature]`](
        node: TSESTree.CallExpression
      ) {
        if (hasInputAsArgument(node)) {
          let parent: TSESTree.Node | undefined = node.parent;
          while (parent && !isFunctionDeclaration(parent)) {
            parent = parent.parent;
          }
          report(node, parent);
        }
      },
    };
  },
});
