import type { TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  getNgrxComponentStoreNames,
  namedCallableExpression,
} from '../../utils';

export const messageId = 'avoidMappingComponentStoreSelectors';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Avoid mapping logic outside the selector level.',
      ngrxModule: 'component-store',
    },
    schema: [],
    messages: {
      [messageId]: 'Map logic at the selector level instead.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const storeNames = getNgrxComponentStoreNames(context);

    const mapOperatorSelector = `[callee.property.name=pipe] > CallExpression[callee.name=map]`;
    const selectors = [
      `ClassDeclaration[superClass.name=/Store/] CallExpression:has(CallExpression[callee.object.type='ThisExpression'][callee.property.name='select'])${mapOperatorSelector}`,
      storeNames &&
        `${namedCallableExpression(storeNames)}${mapOperatorSelector}`,
    ]
      .filter(Boolean)
      .join(',');

    return {
      [selectors](node: TSESTree.ArrowFunctionExpression) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
});
