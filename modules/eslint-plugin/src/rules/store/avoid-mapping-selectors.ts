import type { TSESTree } from '@typescript-eslint/experimental-utils';
import { isCallExpression, isIdentifier } from 'eslint-etc';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  asPattern,
  getNgRxStores,
  namedCallableExpression,
  pipeExpression,
} from '../../utils';

export const messageId = 'avoidMapppingSelectors';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'store',
    docs: {
      description: 'Avoid mapping logic outside the selector level.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]: 'Map logic at the selector level instead.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers = [] } = getNgRxStores(context);
    const storeNames = identifiers.length > 0 ? asPattern(identifiers) : null;

    if (!storeNames) {
      return {};
    }

    const pipeWithSelectAndMapSelector = `${pipeExpression(
      storeNames
    )}:has(CallExpression[callee.name='select'] ~ CallExpression[callee.name='map'])` as const;
    const selectSelector = `${namedCallableExpression(
      storeNames
    )}[callee.object.callee.property.name='select']` as const;

    function isInCreateEffect(node: TSESTree.CallExpression) {
      let parent = node.parent;
      while (parent) {
        if (
          isCallExpression(parent) &&
          isIdentifier(parent.callee) &&
          parent.callee.name === 'createEffect'
        ) {
          return true;
        }
        parent = parent.parent;
      }
      return false;
    }

    return {
      [`:matches(${selectSelector}, ${pipeWithSelectAndMapSelector}) > CallExpression[callee.name='map']:not(:has(ThisExpression))`](
        node: TSESTree.CallExpression
      ) {
        if (isInCreateEffect(node)) {
          return;
        }
        context.report({
          node,
          messageId,
        });
      },
    };
  },
});
