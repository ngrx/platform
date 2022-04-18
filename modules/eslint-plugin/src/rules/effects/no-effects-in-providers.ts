import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  effectsInNgModuleImports,
  effectsInNgModuleProviders,
  getNodeToCommaRemoveFix,
  ngModuleDecorator,
} from '../../utils';

export const messageId = 'noEffectsInProviders';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    ngrxModule: 'effects',
    docs: {
      description:
        '`Effect` should not be listed as a provider if it is added to the `EffectsModule`.',
      recommended: 'error',
    },
    fixable: 'code',
    schema: [],
    messages: {
      [messageId]:
        '`Effect` should not be listed as a provider if it is added to the `EffectsModule`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode();
    const effectsInProviders = new Set<TSESTree.Identifier>();
    const effectsInImports = new Set<string>();

    return {
      [effectsInNgModuleProviders](node: TSESTree.Identifier) {
        effectsInProviders.add(node);
      },
      [effectsInNgModuleImports]({ name }: TSESTree.Identifier) {
        effectsInImports.add(name);
      },
      [`${ngModuleDecorator}:exit`]() {
        for (const effectInProvider of effectsInProviders) {
          if (!effectsInImports.has(effectInProvider.name)) {
            continue;
          }

          context.report({
            node: effectInProvider,
            messageId,
            fix: (fixer) =>
              getNodeToCommaRemoveFix(sourceCode, fixer, effectInProvider),
          });
        }

        effectsInImports.clear();
        effectsInProviders.clear();
      },
    };
  },
});
