import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  asPattern,
  getNgRxStores,
  namedExpression,
  selectExpression,
} from '../../utils';

export const messageId = 'avoidCombiningSelectors';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'store',
    docs: {
      description: 'Prefer combining selectors at the selector level.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]: 'Combine selectors at the selector level.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers = [] } = getNgRxStores(context);
    const storeNames = identifiers.length > 0 ? asPattern(identifiers) : null;

    if (!storeNames) {
      return {};
    }

    const pipeableOrStoreSelect = `:matches(${namedExpression(
      storeNames
    )}[callee.property.name='pipe']:has(CallExpression[callee.name='select']), ${selectExpression(
      storeNames
    )})` as const;

    const selectsInArray: TSESTree.CallExpression[] = [];
    return {
      [`CallExpression[callee.name='combineLatest'] ${pipeableOrStoreSelect} ~ ${pipeableOrStoreSelect}`](
        node: TSESTree.CallExpression
      ) {
        selectsInArray.push(node);
      },
      [`CallExpression[callee.name='combineLatest']:exit`]() {
        for (const node of selectsInArray) {
          context.report({
            node,
            messageId,
          });
        }
        selectsInArray.length = 0;
      },
    };
  },
});
