import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  getImplementsSchemaFixer,
  getImportAddFix,
  getInterface,
  NGRX_MODULE_PATHS,
} from '../../utils';

export const messageId = 'useEffectsLifecycleInterface';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'effects',
    docs: {
      description:
        'Ensures classes implement lifecycle interfaces corresponding to the declared lifecycle methods.',
      recommended: 'warn',
    },
    fixable: 'code',
    schema: [],
    messages: {
      [messageId]:
        'Lifecycle interface `{{ interfaceName }}` should be implemented for method `{{ methodName }}`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const lifecycleMapper = {
      ngrxOnIdentifyEffects: 'OnIdentifyEffects',
      ngrxOnInitEffects: 'OnInitEffects',
      ngrxOnRunEffects: 'OnRunEffects',
    } as const;
    const lifecyclesPattern = Object.keys(lifecycleMapper).join('|');

    return {
      [`ClassDeclaration > ClassBody > MethodDefinition > Identifier[name=/${lifecyclesPattern}/]`](
        node: TSESTree.Identifier & {
          name: keyof typeof lifecycleMapper;
          parent: TSESTree.MethodDefinition & {
            parent: TSESTree.ClassBody & { parent: TSESTree.ClassDeclaration };
          };
        }
      ) {
        const classDeclaration = node.parent.parent.parent;
        const methodName = node.name;
        const interfaceName = lifecycleMapper[methodName];

        if (getInterface(classDeclaration, interfaceName)) {
          return;
        }

        context.report({
          fix: (fixer) => {
            const { implementsNodeReplace, implementsTextReplace } =
              getImplementsSchemaFixer(classDeclaration, interfaceName);
            return [
              fixer.insertTextAfter(
                implementsNodeReplace,
                implementsTextReplace
              ),
            ].concat(
              getImportAddFix({
                compatibleWithTypeOnlyImport: true,
                fixer,
                importName: interfaceName,
                moduleName: NGRX_MODULE_PATHS.effects,
                node: classDeclaration,
              })
            );
          },
          node,
          messageId,
          data: {
            interfaceName,
            methodName,
          },
        });
      },
    };
  },
});
