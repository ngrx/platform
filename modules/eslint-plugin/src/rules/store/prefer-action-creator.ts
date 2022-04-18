import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';

export const messageId = 'preferActionCreator';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'store',
    docs: {
      description: 'Using `action creator` is preferred over `Action class`.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Using `Action class` is forbidden. Use `action creator` instead.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`ClassDeclaration:has(TSClassImplements:matches([expression.name='Action'], [expression.property.name='Action'])):has(PropertyDefinition[key.name='type'])`](
        node: TSESTree.ClassDeclaration
      ) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
});
