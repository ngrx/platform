import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import { ASTUtils } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { createEffectExpression } from '../../utils';

export const messageId = 'preferEffectCallbackInBlockStatement';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'effects',
    docs: {
      description: 'A block statement is easier to troubleshoot.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'The callback of `Effect` should be wrapped in a block statement.',
    },
    fixable: 'code',
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode();
    const nonParametrizedEffect =
      `${createEffectExpression} > ArrowFunctionExpression > .body[type!=/^(ArrowFunctionExpression|BlockStatement)$/]` as const;
    const parametrizedEffect =
      `${createEffectExpression} > ArrowFunctionExpression > ArrowFunctionExpression > .body[type!='BlockStatement']` as const;
    const parametrizedEffectWithinBlockStatement =
      `${createEffectExpression} > ArrowFunctionExpression > BlockStatement > ReturnStatement > ArrowFunctionExpression > .body[type!='BlockStatement']` as const;

    return {
      [`${nonParametrizedEffect}, ${parametrizedEffect}, ${parametrizedEffectWithinBlockStatement}`](
        node: TSESTree.ArrowFunctionExpression['body']
      ) {
        context.report({
          node,
          messageId,
          fix: (fixer) => {
            const [previousNode, nextNode] = getSafeNodesToApplyFix(
              sourceCode,
              node
            );
            return [
              fixer.insertTextBefore(previousNode, `{ return `),
              fixer.insertTextAfter(nextNode, ` }`),
            ];
          },
        });
      },
    };
  },
});

function getSafeNodesToApplyFix(
  sourceCode: Readonly<TSESLint.SourceCode>,
  node: TSESTree.Node
) {
  const previousToken = sourceCode.getTokenBefore(node);
  const nextToken = sourceCode.getTokenAfter(node);

  if (
    previousToken &&
    ASTUtils.isOpeningParenToken(previousToken) &&
    nextToken &&
    ASTUtils.isClosingParenToken(nextToken)
  ) {
    return [previousToken, nextToken] as const;
  }

  return [node, node] as const;
}
