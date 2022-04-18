import type { TSESLint } from '@typescript-eslint/experimental-utils';
import { ESLintUtils } from '@typescript-eslint/experimental-utils';
import type { NGRX_MODULE } from './utils';
import { docsUrl, ngrxVersionSatisfies, NGRX_MODULE_PATHS } from './utils';

type Meta<TMessageIds extends string> =
  | TSESLint.RuleMetaData<TMessageIds> & {
      ngrxModule: NGRX_MODULE;
      version?: string;
    };
type CreateRuleMeta<TMessageIds extends string> = {
  docs: Omit<TSESLint.RuleMetaDataDocs, 'url'>;
} & Omit<Meta<TMessageIds>, 'docs'>;
export type NgRxRuleModule<
  TOptions extends readonly unknown[],
  TMessageIds extends string
> = Omit<TSESLint.RuleModule<TMessageIds, TOptions>, 'meta'> & {
  meta: Meta<TMessageIds>;
};

export function createRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string
>(
  config: Readonly<{
    name: string;
    meta: CreateRuleMeta<TMessageIds>;
    defaultOptions: Readonly<TOptions>;
    create: (
      context: Readonly<TSESLint.RuleContext<TMessageIds, TOptions>>,
      optionsWithDefault: Readonly<TOptions>
    ) => TSESLint.RuleListener;
  }>
): TSESLint.RuleModule<TMessageIds, TOptions> {
  const configOverwrite = {
    ...config,
    create: (
      context: Readonly<TSESLint.RuleContext<TMessageIds, TOptions>>,
      optionsWithDefault: Readonly<TOptions>
    ) => {
      const {
        meta: { ngrxModule, version },
      } = config;
      if (
        version !== undefined &&
        !ngrxVersionSatisfies(NGRX_MODULE_PATHS[ngrxModule], version)
      ) {
        return {};
      }

      return config.create(context, optionsWithDefault);
    },
  };

  return ESLintUtils.RuleCreator(docsUrl)(configOverwrite);
}
