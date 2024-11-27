import path = require('path');
import { createRule } from '../../rule-creator';
import { TSESTree } from '@typescript-eslint/types';

export const messageId = 'requireSuperOnDestroy';
type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    ngrxModule: 'component-store',
    docs: {
      description:
        'Overriden ngOnDestroy method in component stores require a call to super.ngOnDestroy().',
    },
    schema: [],
    messages: {
      [messageId]:
        "Call super.ngOnDestroy() inside a component store's ngOnDestroy method.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    const ngOnDestroyMethodSelector = `MethodDefinition[key.name='ngOnDestroy']`;

    return {
      [`ClassDeclaration[superClass.name=ComponentStore] ${ngOnDestroyMethodSelector}:not(:has(CallExpression[callee.object.type='Super'][callee.property.name='ngOnDestroy']))`](
        node: TSESTree.MethodDefinition
      ) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
});
