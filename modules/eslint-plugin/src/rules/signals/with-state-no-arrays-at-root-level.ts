import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { isArrayExpression } from '../../utils';

export const messageId = 'withStateNoArraysAtRootLevel';

type MessageIds = typeof messageId;
type Options = readonly [];

const NON_RECORD_TYPES = [
  'Array',
  'Set',
  'Map',
  'WeakSet',
  'WeakMap',
  'Date',
  'Error',
  'RegExp',
  'ArrayBuffer',
  'DataView',
  'Promise',
  'Function',
];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      description: `withState should accept a record or dictionary as an input argument.`,
      ngrxModule: 'signals',
      requiresTypeChecking: true,
    },
    schema: [],
    messages: {
      [messageId]:
        'The property type `{{ property }}` is forbidden as the initial state argument, wrap the property in a record or dictionary.',
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
            data: { property: 'Array' },
          });
        } else if (argument) {
          const services = ESLintUtils.getParserServices(context);
          const typeChecker = services.program.getTypeChecker();
          const type = services.getTypeAtLocation(argument);

          if (typeChecker.isArrayType(type) || typeChecker.isTupleType(type)) {
            context.report({
              node: argument,
              messageId,
              data: { property: 'Array' },
            });
            return;
          }

          const symbol = type.getSymbol();
          if (symbol && NON_RECORD_TYPES.includes(symbol.getName())) {
            context.report({
              node: argument,
              messageId,
              data: { property: symbol.getName() },
            });
            return;
          }

          const callSignatures = type.getCallSignatures();
          if (callSignatures.length > 0) {
            context.report({
              node: argument,
              messageId,
              data: { property: 'Function' },
            });
            return;
          }

          const typeString = typeChecker.typeToString(type);
          const matchedType = NON_RECORD_TYPES.find((t) =>
            typeString.startsWith(`${t}<`)
          );
          if (matchedType) {
            context.report({
              node: argument,
              messageId,
              data: { property: matchedType },
            });
          }
        }
      },
    };
  },
});
