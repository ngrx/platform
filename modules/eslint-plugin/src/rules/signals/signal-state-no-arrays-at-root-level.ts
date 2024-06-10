import { type TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { isArrayExpression } from '../../utils';

export const messageId = 'signalStateNoArraysAtRootLevel';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    ngrxModule: 'signals',
    docs: {
      description: `signalState should accept a record or dictionary as an input argument.`,
    },
    schema: [],
    messages: {
      [messageId]: `Wrap the array in an record or dictionary.`,
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`CallExpression[callee.name=signalState]`](
        node: TSESTree.CallExpression
      ) {
        const [argument] = node.arguments;
        if (isArrayExpression(argument)) {
          context.report({
            node: argument,
            messageId,
          });
        }
      },
    };
  },
});
