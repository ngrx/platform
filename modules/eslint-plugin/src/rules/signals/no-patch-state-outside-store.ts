import { type TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { isArrowFunctionExpression, isIdentifier } from '../../utils';

export const messageId = 'noPatchStateOutsideStore';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'signals',
    docs: {
      description: `patchState should not be called outside of the store context.`,
      requiresTypeChecking: false,
    },
    schema: [],
    messages: {
      [messageId]: `Invoke patchState within the context of the store.`,
    },
  },
  defaultOptions: [],
  create: (context) => {
    let inWithMethods = false;
    let withMethodsStore: TSESTree.Identifier | null = null;

    return {
      ['CallExpression[callee.name=withMethods]'](
        node: TSESTree.CallExpression
      ) {
        inWithMethods = true;
        const [arrowArg] = node.arguments;
        if (isArrowFunctionExpression(arrowArg)) {
          const [storeArg] = arrowArg.params;
          withMethodsStore = isIdentifier(storeArg) ? storeArg : null;
        }
      },
      ['CallExpression[callee.name=withMethods]:exit']() {
        inWithMethods = false;
        withMethodsStore = null;
      },
      ['CallExpression[callee.name=patchState]'](
        node: TSESTree.CallExpression
      ) {
        if (!inWithMethods) {
          context.report({
            node,
            messageId,
          });
        } else if (withMethodsStore) {
          const [patchStateStore] = node.arguments;
          if (
            isIdentifier(patchStateStore) &&
            patchStateStore.name !== withMethodsStore.name
          ) {
            context.report({
              node,
              messageId,
            });
          }
        }
      },
    };
  },
});
