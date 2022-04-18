import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import { isArrowFunctionExpression } from 'eslint-etc';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  asPattern,
  createEffectExpression,
  getImportAddFix,
  getNgRxEffectActions,
  namedExpression,
  NGRX_MODULE_PATHS,
} from '../../utils';

export const messageId = 'preferConcatLatestFrom';

type MessageIds = typeof messageId;
type Options = readonly [{ readonly strict: boolean }];
type WithLatestFromIdentifier = TSESTree.Identifier & {
  parent: TSESTree.CallExpression;
};

const defaultOptions: Options[number] = { strict: false };
const concatLatestFromKeyword = 'concatLatestFrom';
const withLatestFromKeyword = 'withLatestFrom';

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    ngrxModule: 'effects',
    version: '>=12.0.0',
    docs: {
      description: `Use \`${concatLatestFromKeyword}\` instead of \`${withLatestFromKeyword}\` to prevent the selector from firing until the correct \`Action\` is dispatched.`,
      recommended: 'warn',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          strict: {
            type: 'boolean',
            default: defaultOptions.strict,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [messageId]: `Use \`${concatLatestFromKeyword}\` instead of \`${withLatestFromKeyword}\`.`,
    },
  },
  defaultOptions: [defaultOptions],
  create: (context, [options]) => {
    if (options.strict) {
      return {
        [`${createEffectExpression} CallExpression > Identifier[name='withLatestFrom']`](
          node: WithLatestFromIdentifier
        ) {
          context.report({
            node,
            messageId,
            fix: (fixer) => getFixes(context.getSourceCode(), fixer, node),
          });
        },
      };
    }

    const { identifiers = [], sourceCode } = getNgRxEffectActions(context);
    const actionsNames = identifiers.length > 0 ? asPattern(identifiers) : null;

    if (!actionsNames) {
      return {};
    }

    return {
      [`${createEffectExpression} ${namedExpression(
        actionsNames
      )} > CallExpression[arguments.length=1] > Identifier[name='${withLatestFromKeyword}']`](
        node: WithLatestFromIdentifier
      ) {
        context.report({
          node,
          messageId,
          fix: (fixer) => getFixes(sourceCode, fixer, node),
        });
      },
      [`${createEffectExpression} ${namedExpression(
        actionsNames
      )} > CallExpression[arguments.length>1] > Identifier[name='${withLatestFromKeyword}']`](
        node: WithLatestFromIdentifier
      ) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
});

function getFixes(
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
  node: WithLatestFromIdentifier
) {
  const { parent } = node;
  const isUsingDeprecatedProjectorArgument = parent.arguments.length > 1;
  const [firstArgument] = parent.arguments;
  const nextToken =
    isUsingDeprecatedProjectorArgument &&
    sourceCode.getTokenAfter(firstArgument);
  return [
    fixer.replaceText(node, concatLatestFromKeyword),
    ...(isArrowFunctionExpression(firstArgument)
      ? []
      : [fixer.insertTextBefore(firstArgument, '() => ')]),
  ].concat(
    getImportAddFix({
      fixer,
      importName: concatLatestFromKeyword,
      moduleName: NGRX_MODULE_PATHS.effects,
      node,
    }),
    ...(isUsingDeprecatedProjectorArgument && nextToken
      ? [
          getImportAddFix({
            fixer,
            importName: 'map',
            moduleName: 'rxjs/operators',
            node,
          }),
          fixer.insertTextAfterRange(nextToken.range, '), map('),
        ]
      : [])
  );
}
