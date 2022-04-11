import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  asPattern,
  dispatchInEffects,
  getNgRxStores,
  isArrowFunctionExpression,
  isReturnStatement,
} from '../../utils';

export const noDispatchInEffects = 'noDispatchInEffects';
export const noDispatchInEffectsSuggest = 'noDispatchInEffectsSuggest';

type MessageIds =
  | typeof noDispatchInEffects
  | typeof noDispatchInEffectsSuggest;
type Options = readonly [];
type MemberExpressionWithinCallExpression = TSESTree.MemberExpression & {
  parent: TSESTree.CallExpression;
};

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'effects',
    hasSuggestions: true,
    docs: {
      description: '`Effect` should not call `store.dispatch`.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [noDispatchInEffects]:
        'Calling `store.dispatch` in `Effect` is forbidden.',
      [noDispatchInEffectsSuggest]: 'Remove `store.dispatch`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers = [] } = getNgRxStores(context);
    const storeNames = identifiers.length > 0 ? asPattern(identifiers) : null;

    if (!storeNames) {
      return {};
    }

    return {
      [dispatchInEffects(storeNames)](
        node: MemberExpressionWithinCallExpression
      ) {
        const nodeToReport = getNodeToReport(node);
        context.report({
          node: nodeToReport,
          messageId: noDispatchInEffects,
          suggest: [
            {
              messageId: noDispatchInEffectsSuggest,
              fix: (fixer) => fixer.remove(nodeToReport),
            },
          ],
        });
      },
    };
  },
});

function getNodeToReport(node: MemberExpressionWithinCallExpression) {
  const { parent } = node;
  const { parent: grandParent } = parent;
  return grandParent &&
    (isArrowFunctionExpression(grandParent) || isReturnStatement(grandParent))
    ? node
    : parent;
}
