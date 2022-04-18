import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  getNgRxStores,
  getNodeToCommaRemoveFix,
  isTSParameterProperty,
} from '../../utils';

export const noMultipleGlobalStores = 'noMultipleGlobalStores';
export const noMultipleGlobalStoresSuggest = 'noMultipleGlobalStoresSuggest';

type MessageIds =
  | typeof noMultipleGlobalStores
  | typeof noMultipleGlobalStoresSuggest;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    ngrxModule: 'store',
    docs: {
      description: 'There should only be one global store injected.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [noMultipleGlobalStores]: 'Global store should be injected only once.',
      [noMultipleGlobalStoresSuggest]: 'Remove this reference.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      Program() {
        const { identifiers = [], sourceCode } = getNgRxStores(context);
        const flattenedIdentifiers = groupBy(identifiers).values();

        for (const identifiers of flattenedIdentifiers) {
          if (identifiers.length <= 1) {
            continue;
          }

          for (const node of identifiers) {
            const nodeToReport = getNodeToReport(node);
            context.report({
              node: nodeToReport,
              messageId: noMultipleGlobalStores,
              suggest: [
                {
                  messageId: noMultipleGlobalStoresSuggest,
                  fix: (fixer) => getFixes(sourceCode, fixer, nodeToReport),
                },
              ],
            });
          }
        }
      },
    };
  },
});

function getNodeToReport(node: TSESTree.Node) {
  return node.parent && isTSParameterProperty(node.parent) ? node.parent : node;
}

function getFixes(
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
  node: TSESTree.Node
) {
  const { parent } = node;
  const nodeToRemove = parent && isTSParameterProperty(parent) ? parent : node;
  return getNodeToCommaRemoveFix(sourceCode, fixer, nodeToRemove);
}

type Identifiers = NonNullable<ReturnType<typeof getNgRxStores>['identifiers']>;

function groupBy(identifiers: Identifiers): Map<TSESTree.Node, Identifiers> {
  return identifiers.reduce<Map<TSESTree.Node, Identifiers>>(
    (accumulator, identifier) => {
      const parent = isTSParameterProperty(identifier.parent)
        ? identifier.parent.parent
        : identifier.parent;
      const collectedIdentifiers = accumulator.get(parent);
      return accumulator.set(parent, [
        ...(collectedIdentifiers ?? []),
        identifier,
      ]);
    },
    new Map()
  );
}
