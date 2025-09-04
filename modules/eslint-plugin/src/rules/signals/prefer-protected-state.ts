import { type TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';

export const preferProtectedState = 'preferProtectedState';
export const preferProtectedStateSuggest = 'preferProtectedStateSuggest';

type MessageIds =
  | typeof preferProtectedState
  | typeof preferProtectedStateSuggest;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    docs: {
      description: `A Signal Store prefers protected state`,
      ngrxModule: 'signals',
    },
    schema: [],
    messages: {
      [preferProtectedState]:
        '{ protectedState: false } should be removed to prevent external state mutations.',
      [preferProtectedStateSuggest]: 'Remove `{protectedState: false}`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`CallExpression[callee.name=signalStore][arguments.length>0] > ObjectExpression[properties.length>0] > Property[key.name=protectedState][value.value=false]`](
        node: TSESTree.Property
      ) {
        context.report({
          node,
          messageId: preferProtectedState,
          suggest: [
            {
              messageId: preferProtectedStateSuggest,
              fix: (fixer) => {
                const getRangeToBeRemoved = (): Parameters<
                  typeof fixer.removeRange
                >[0] => {
                  const parentObject = node.parent as TSESTree.ObjectExpression;
                  const parentObjectHasOnlyOneProperty =
                    parentObject.properties.length === 1;

                  if (parentObjectHasOnlyOneProperty) {
                    /**
                     * Remove the entire object if it contains only one property - the relevant one
                     */
                    return parentObject.range;
                  }

                  const tokenAfter = context.sourceCode.getTokenAfter(node);
                  const tokenAfterIsComma = tokenAfter?.value?.trim() === ',';
                  /**
                   * Remove the specific property if there is more than one property in the parent
                   */
                  return [
                    node.range[0],
                    /**
                     *  remove trailing comma as well
                     */
                    tokenAfterIsComma ? tokenAfter.range[1] : node.range[1],
                  ];
                };

                return fixer.removeRange(getRangeToBeRemoved());
              },
            },
          ],
        });
      },
    };
  },
});
