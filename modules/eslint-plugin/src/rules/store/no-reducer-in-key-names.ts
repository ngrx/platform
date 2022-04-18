import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  actionReducerMap,
  getRawText,
  metadataProperty,
  storeActionReducerMap,
} from '../../utils';

export const noReducerInKeyNames = 'noReducerInKeyNames';
export const noReducerInKeyNamesSuggest = 'noReducerInKeyNamesSuggest';

type MessageIds =
  | typeof noReducerInKeyNames
  | typeof noReducerInKeyNamesSuggest;
type Options = readonly [];

const reducerKeyword = 'reducer';

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    ngrxModule: 'store',
    docs: {
      description: `Avoid the word "${reducerKeyword}" in the key names.`,
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [noReducerInKeyNames]: `Avoid the word "${reducerKeyword}" in the key names to better represent the state.`,
      [noReducerInKeyNamesSuggest]: `Remove the word "${reducerKeyword}".`,
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`:matches(${storeActionReducerMap}, ${actionReducerMap}) > ${metadataProperty(
        /reducer/i
      )} > .key`](node: TSESTree.Property['key']) {
        context.report({
          node,
          messageId: noReducerInKeyNames,
          suggest: [
            {
              messageId: noReducerInKeyNamesSuggest,
              fix: (fixer) => {
                const keyName = getRawText(node);

                if (!keyName) {
                  return null;
                }

                return fixer.replaceText(
                  node,
                  keyName.replace(new RegExp(reducerKeyword, 'i'), '')
                );
              },
            },
          ],
        });
      },
    };
  },
});
