import { type TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { isCallExpression, isIdentifier } from '../../utils';

export const enforceTypeCall = 'enforceTypeCall';

type MessageIds = typeof enforceTypeCall;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    ngrxModule: 'signals',
    docs: {
      description: 'The `type` function must be called.',
    },
    fixable: 'code',
    schema: [],
    messages: {
      [enforceTypeCall]: 'The `{{name}}` function must be called.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    // It's possible that we have multiple type import aliases, so we need to track them all.
    const typeNames = new Set<string>();

    return {
      [`ImportDeclaration[source.value='@ngrx/signals'] ImportSpecifier[imported.name='type']`](
        node: TSESTree.ImportSpecifier
      ) {
        typeNames.add(node.local.name);
      },

      TSInstantiationExpression(node: TSESTree.TSInstantiationExpression) {
        const expression = node.expression;
        if (
          isIdentifier(expression) &&
          typeNames.has(expression.name) &&
          !isCallExpression(node.parent)
        ) {
          context.report({
            node: expression,
            messageId: enforceTypeCall,
            data: { name: expression.name },
            fix: (fixer) => fixer.insertTextAfter(node, '()'),
          });
        }
      },
    };
  },
});
