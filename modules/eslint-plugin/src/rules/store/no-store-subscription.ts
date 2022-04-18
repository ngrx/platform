import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { asPattern, getNgRxStores, namedCallableExpression } from '../../utils';

export const messageId = 'noStoreSubscription';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'store',
    docs: {
      description:
        'Using the `async` pipe is preferred over `store` subscription.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        '`Store` subscription is forbidden. Use the `async` pipe instead.',
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
      [`${namedCallableExpression(
        storeNames
      )} > MemberExpression > Identifier[name='subscribe']`](
        node: TSESTree.Identifier
      ) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
});
