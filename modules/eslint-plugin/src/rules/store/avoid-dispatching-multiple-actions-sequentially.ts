import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { asPattern, dispatchExpression, getNgRxStores } from '../../utils';

export const messageId = 'avoidDispatchingMultipleActionsSequentially';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'store',
    docs: {
      description: 'It is recommended to only dispatch one `Action` at a time.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Avoid dispatching many actions in a row to accomplish a larger conceptual "transaction".',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers = [] } = getNgRxStores(context);
    const storeNames = identifiers.length > 0 ? asPattern(identifiers) : null;

    if (!storeNames) {
      return {};
    }

    const collectedDispatches = new Set<TSESTree.CallExpression>();

    return {
      [`BlockStatement > ExpressionStatement > ${dispatchExpression(
        storeNames
      )}`](node: TSESTree.CallExpression) {
        collectedDispatches.add(node);
      },
      'BlockStatement:exit'() {
        if (collectedDispatches.size > 1) {
          for (const node of collectedDispatches) {
            context.report({
              node,
              messageId,
            });
          }
        }

        collectedDispatches.clear();
      },
    };
  },
});
