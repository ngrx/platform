import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import { ASTUtils } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { getLast, onFunctionWithoutType } from '../../utils';

export const onFunctionExplicitReturnType = 'onFunctionExplicitReturnType';
export const onFunctionExplicitReturnTypeSuggest =
  'onFunctionExplicitReturnTypeSuggest';

type MessageIds =
  | typeof onFunctionExplicitReturnType
  | typeof onFunctionExplicitReturnTypeSuggest;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    ngrxModule: 'store',
    docs: {
      description: '`On` function should have an explicit return type.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [onFunctionExplicitReturnType]:
        '`On` functions should have an explicit return type when using arrow functions: `on(action, (state): State => {}`.',
      [onFunctionExplicitReturnTypeSuggest]:
        'Add the explicit return type `State` (if the interface/type is named differently you need to manually correct the return type).',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode();

    return {
      [onFunctionWithoutType](node: TSESTree.ArrowFunctionExpression) {
        context.report({
          node,
          messageId: onFunctionExplicitReturnType,
          suggest: [
            {
              messageId: onFunctionExplicitReturnTypeSuggest,
              fix: (fixer) => getFixes(node, sourceCode, fixer),
            },
          ],
        });
      },
    };
  },
});

function getFixes(
  node: TSESTree.ArrowFunctionExpression,
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer
) {
  const { params } = node;

  if (params.length === 0) {
    const [, closingParen] = sourceCode.getTokens(node);
    return fixer.insertTextAfter(closingParen, ': State');
  }

  const [firstParam] = params;
  const lastParam = getLast(params);
  const previousToken = sourceCode.getTokenBefore(firstParam);
  const isParenthesized =
    previousToken && ASTUtils.isOpeningParenToken(previousToken);

  if (isParenthesized) {
    const nextToken = sourceCode.getTokenAfter(lastParam);
    return fixer.insertTextAfter(nextToken ?? lastParam, ': State');
  }

  return [
    fixer.insertTextBefore(firstParam, '('),
    fixer.insertTextAfter(lastParam, '): State'),
  ] as const;
}
