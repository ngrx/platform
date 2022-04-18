import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { createReducer, getNodeToCommaRemoveFix } from '../../utils';

export const avoidDuplicateActionsInReducer = 'avoidDuplicateActionsInReducer';
export const avoidDuplicateActionsInReducerSuggest =
  'avoidDuplicateActionsInReducerSuggest';

type MessageIds =
  | typeof avoidDuplicateActionsInReducer
  | typeof avoidDuplicateActionsInReducerSuggest;
type Options = readonly [];
type Action = TSESTree.Identifier & { parent: TSESTree.CallExpression };

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    ngrxModule: 'store',
    docs: {
      description: 'A `Reducer` should handle an `Action` once.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [avoidDuplicateActionsInReducer]:
        'The `Reducer` handles a duplicate `Action` `{{ actionName }}`.',
      [avoidDuplicateActionsInReducerSuggest]: 'Remove this duplication.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode();
    const collectedActions = new Map<string, Action[]>();

    return {
      [`${createReducer} > CallExpression[callee.name='on'][arguments.0.type='Identifier']`]({
        arguments: [action],
      }: TSESTree.CallExpression & {
        arguments: Action[];
      }) {
        const actions = collectedActions.get(action.name) ?? [];
        collectedActions.set(action.name, [...actions, action]);
      },
      [`${createReducer}:exit`]() {
        for (const [actionName, identifiers] of collectedActions) {
          if (identifiers.length <= 1) {
            break;
          }

          for (const node of identifiers) {
            context.report({
              node,
              messageId: avoidDuplicateActionsInReducer,
              data: {
                actionName,
              },
              suggest: [
                {
                  messageId: avoidDuplicateActionsInReducerSuggest,
                  fix: (fixer) =>
                    getNodeToCommaRemoveFix(sourceCode, fixer, node.parent),
                },
              ],
            });
          }
        }

        collectedActions.clear();
      },
    };
  },
});
