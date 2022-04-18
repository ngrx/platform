import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  asPattern,
  getNgRxStores,
  isArrowFunctionExpression,
  isFunctionExpression,
  isLiteral,
  pipeableSelect,
  selectExpression,
} from '../../utils';

export const messageId = 'preferSelectorInSelect';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'store',
    docs: {
      description:
        'Using a selector in the `select` is preferred over `string` or `props drilling`.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Using `string` or `props drilling` is forbidden. Use a selector instead.',
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
      [`${pipeableSelect(storeNames)}, ${selectExpression(storeNames)}`](
        node: TSESTree.CallExpression
      ) {
        for (const argument of node.arguments) {
          if (
            !isLiteral(argument) &&
            !isArrowFunctionExpression(argument) &&
            !isFunctionExpression(argument)
          ) {
            break;
          }

          context.report({
            node: argument,
            messageId,
          });
        }
      },
    };
  },
});
