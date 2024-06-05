import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  createEffectExpression,
  mapLikeOperatorsExplicitReturn,
  mapLikeOperatorsImplicitReturn,
} from '../../utils';

export const messageId = 'noMultipleActionsInEffects';

type MessageIds = typeof messageId;
type Options = readonly unknown[];
type EffectsMapLikeOperatorsReturn =
  | TSESTree.ArrowFunctionExpression
  | TSESTree.CallExpression
  | TSESTree.ReturnStatement;

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    ngrxModule: 'effects',
    docs: {
      description: '`Effect` should not return multiple actions.',
      requiresTypeChecking: true,
    },
    schema: [],
    messages: {
      [messageId]: '`Effect` should return a single action.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`${createEffectExpression} :matches(${mapLikeOperatorsImplicitReturn}, ${mapLikeOperatorsExplicitReturn})`](
        node: EffectsMapLikeOperatorsReturn
      ) {
        const nodeToReport = getNodeToReport(node);
        if (!nodeToReport) {
          return;
        }

        const services = ESLintUtils.getParserServices(context);
        const typeChecker = services.program.getTypeChecker();
        const type = services.getTypeAtLocation(nodeToReport);

        if (typeChecker.isArrayType(type)) {
          context.report({
            node: nodeToReport,
            messageId,
          });
        } else if (
          type.isUnion() &&
          type.types.some((ut) => !typeChecker.isArrayType(ut))
        ) {
          context.report({
            node: nodeToReport,
            messageId,
          });
        }
      },
    };
  },
});

function getNodeToReport(node: EffectsMapLikeOperatorsReturn) {
  switch (node.type) {
    case AST_NODE_TYPES.ArrowFunctionExpression:
      return node.body;
    case AST_NODE_TYPES.CallExpression:
      return node.arguments[0];
    default:
      return node.argument;
  }
}
