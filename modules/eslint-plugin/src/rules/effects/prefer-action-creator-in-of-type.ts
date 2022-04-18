import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';

export const messageId = 'preferActionCreatorInOfType';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'effects',
    docs: {
      description:
        'Using `action creator` in `ofType` is preferred over `string`.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]: 'Using `string` is forbidden. Use `action creator` instead.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`CallExpression[callee.name='ofType'] Literal`](node: TSESTree.Literal) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
});
