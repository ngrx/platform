import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  asPattern,
  getNgRxComponentStores,
  namedExpression,
} from '../../utils';

export const messageId = 'updaterExplicitReturnType';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    ngrxModule: 'component-store',
    docs: {
      description: '`Updater` should have an explicit return type.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        '`Updater` should have an explicit return type when using arrow functions: `this.store.updater((state, value): State => {}`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers = [] } = getNgRxComponentStores(context);
    const storeNames = identifiers.length > 0 ? asPattern(identifiers) : null;
    const withoutTypeAnnotation = `ArrowFunctionExpression:not([returnType.typeAnnotation])`;
    const selectors = [
      `ClassDeclaration[superClass.name='ComponentStore'] CallExpression[callee.object.type='ThisExpression'][callee.property.name='updater'] > ${withoutTypeAnnotation}`,
      storeNames &&
        `${namedExpression(
          storeNames
        )}[callee.property.name='updater'] > ${withoutTypeAnnotation}`,
    ]
      .filter(Boolean)
      .join(',');

    return {
      [selectors](node: TSESTree.ArrowFunctionExpression) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
});
