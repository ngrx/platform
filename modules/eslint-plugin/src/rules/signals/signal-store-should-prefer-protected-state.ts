import { type TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';

export const signalStoreShouldPreferProtectedState =
  'signalStoreShouldPreferProtectedState';
export const signalStoreShouldPreferProtectedStateSuggest =
  'signalStoreShouldPreferProtectedStateSuggest';

type MessageIds =
  | typeof signalStoreShouldPreferProtectedState
  | typeof signalStoreShouldPreferProtectedStateSuggest;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    ngrxModule: 'signals',
    docs: {
      description: `A Signal Store should prefer protected state`,
    },
    schema: [],
    messages: {
      [signalStoreShouldPreferProtectedState]: '{ protectedState: false } should be removed to prevent external state mutations.',
      [signalStoreShouldPreferProtectedStateSuggest]: `{ protectedState: false } should be removed to prevent external state mutations.`,
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
          messageId: signalStoreShouldPreferProtectedState,
          suggest: [
            {
              messageId: signalStoreShouldPreferProtectedStateSuggest,
              fix: (fixer) => {
                const sourceFile = context.sourceCode;
                const tokenAfter = sourceFile.getTokenAfter(node);
                const tokenAfterIsComma = tokenAfter?.value?.trim() === ',';
                return fixer.removeRange([
                  node.range[0],
                  /* remove trailing comma as well */
                  tokenAfterIsComma ? tokenAfter.range[1] : node.range[1],
                ]);
              },
            },
          ],
        });
      },
    };
  },
});
