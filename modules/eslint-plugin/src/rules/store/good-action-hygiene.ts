import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { actionCreatorWithLiteral } from '../../utils';

export const messageId = 'goodActionHygiene';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'store',
    docs: {
      description: 'Ensures the use of good action hygiene.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Action type `{{ actionType }}` does not follow the good action hygiene practice, use "[Source] {{ actionType }}" to define action types.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceEventPattern = /[[].*[\]]\s.*/;

    return {
      [actionCreatorWithLiteral]({
        arguments: [node],
      }: Omit<TSESTree.CallExpression, 'arguments'> & {
        arguments: TSESTree.StringLiteral[];
      }) {
        const { value: actionType } = node;

        if (sourceEventPattern.test(actionType)) {
          return;
        }

        context.report({
          node,
          messageId,
          data: {
            actionType,
          },
        });
      },
    };
  },
});
