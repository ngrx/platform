import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  effectCreator,
  effectDecorator,
  getDecorator,
  getDecoratorArguments,
  getImportDeclarations,
  getImportRemoveFix,
  NGRX_MODULE_PATHS,
} from '../../utils';

export const noEffectDecoratorAndCreator = 'noEffectDecoratorAndCreator';
export const noEffectDecoratorAndCreatorSuggest =
  'noEffectDecoratorAndCreatorSuggest';

type MessageIds =
  | typeof noEffectDecoratorAndCreator
  | typeof noEffectDecoratorAndCreatorSuggest;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    ngrxModule: 'effects',
    docs: {
      description:
        '`Effect` should use either the `createEffect` or the `@Effect` decorator, but not both.',
      recommended: 'error',
      suggestion: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      [noEffectDecoratorAndCreator]:
        'Using the `createEffect` and the `@Effect` decorator simultaneously is forbidden.',
      [noEffectDecoratorAndCreatorSuggest]: 'Remove the `@Effect` decorator.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode();

    return {
      [`${effectCreator}:has(${effectDecorator})`](
        node: TSESTree.PropertyDefinition
      ) {
        const decorator = getDecorator(node, 'Effect');

        if (!decorator) {
          return;
        }

        const hasDecoratorArgument = Boolean(
          getDecoratorArguments(decorator)[0]
        );
        const fix: TSESLint.ReportFixFunction = (fixer) =>
          getFixes(node, sourceCode, fixer, decorator);

        if (hasDecoratorArgument) {
          context.report({
            node: node.key,
            messageId: noEffectDecoratorAndCreator,
            // In this case where the argument to the `@Effect({...})`
            // decorator exists, it is more appropriate to **suggest**
            // instead of **fix**, since either simply removing or merging
            // the arguments would likely generate unexpected behaviors and
            // would be quite costly.
            suggest: [
              {
                messageId: noEffectDecoratorAndCreatorSuggest,
                fix,
              },
            ],
          });
        } else {
          context.report({
            node: node.key,
            messageId: noEffectDecoratorAndCreator,
            fix,
          });
        }
      },
    };
  },
});

function getFixes(
  node: TSESTree.PropertyDefinition,
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
  decorator: TSESTree.Decorator
): readonly TSESLint.RuleFix[] {
  const importDeclarations =
    getImportDeclarations(node, NGRX_MODULE_PATHS.effects) ?? [];
  const text = sourceCode.getText();
  const totalEffectDecoratorOccurrences = getEffectDecoratorOccurrences(text);
  const importRemoveFix =
    totalEffectDecoratorOccurrences === 1
      ? getImportRemoveFix(sourceCode, importDeclarations, 'Effect', fixer)
      : [];

  return [fixer.remove(decorator)].concat(importRemoveFix);
}

function getEffectDecoratorOccurrences(text: string) {
  return text.replace(/\s/g, '').match(/@Effect/g)?.length ?? 0;
}
