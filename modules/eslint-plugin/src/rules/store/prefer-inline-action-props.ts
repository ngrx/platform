import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { actionCreatorPropsComputed } from '../../utils';

export const preferInlineActionProps = 'preferInlineActionProps';
export const preferInlineActionPropsSuggest = 'preferInlineActionPropsSuggest';

type MessageIds =
  | typeof preferInlineActionProps
  | typeof preferInlineActionPropsSuggest;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    ngrxModule: 'store',
    docs: {
      description:
        'Prefer using inline types instead of interfaces, types or classes.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [preferInlineActionProps]:
        'Use inline types instead of interfaces, types or classes.',
      [preferInlineActionPropsSuggest]: 'Change to inline types.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [actionCreatorPropsComputed](node: TSESTree.TSTypeReference) {
        context.report({
          node,
          messageId: preferInlineActionProps,
          suggest: [
            {
              messageId: preferInlineActionPropsSuggest,
              fix: (fixer) => [
                fixer.insertTextBefore(node, '{name: '),
                fixer.insertTextAfter(node, '}'),
              ],
            },
          ],
        });
      },
    };
  },
});
