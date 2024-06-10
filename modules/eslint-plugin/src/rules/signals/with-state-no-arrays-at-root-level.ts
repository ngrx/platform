import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { isArrayExpression } from '../../utils';

export const messageId = 'withStateNoArraysAtRootLevel';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    ngrxModule: 'signals',
    docs: {
      description: `withState should accept a record or dictionary as an input argument.`,
      requiresTypeChecking: true,
    },
    schema: [],
    messages: {
      [messageId]: `Wrap the array in an record or dictionary.`,
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`CallExpression[callee.name=withState]`](node: TSESTree.CallExpression) {
        const [argument] = node.arguments;
        if (isArrayExpression(argument)) {
          context.report({
            node: argument,
            messageId,
          });
        } else if (argument) {
          const services = ESLintUtils.getParserServices(context);
          const typeChecker = services.program.getTypeChecker();
          const type = services.getTypeAtLocation(argument);

          if (typeChecker.isArrayType(type)) {
            context.report({
              node: argument,
              messageId,
            });
          }
        }
      },
    };
  },
});
