import type { TSESLint } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';
import type { NGRX_MODULE } from './utils';
import { docsUrl, ngrxVersionSatisfies, NGRX_MODULE_PATHS } from './utils';

type Meta<TMessageIds extends string, TOptions extends readonly unknown[]> =
  | TSESLint.RuleMetaData<TMessageIds, TOptions> & {
      ngrxModule: NGRX_MODULE;
      version?: string;
      docs: { requiresTypeChecking?: boolean };
    };

type CreateRuleMeta<
  TMessageIds extends string,
  TOptions extends readonly unknown[]
> = {
  docs: Omit<TSESLint.RuleMetaDataDocs<TOptions>, 'url'> & {
    requiresTypeChecking?: boolean;
  };
} & Omit<Meta<TMessageIds, TOptions>, 'docs'>;
export type NgRxRuleModule<
  TOptions extends readonly unknown[],
  TMessageIds extends string
> = Omit<TSESLint.RuleModule<TMessageIds, TOptions>, 'meta'> & {
  meta: Meta<TMessageIds, TOptions>;
};

export function createRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string
>(
  config: Readonly<{
    name: string;
    meta: CreateRuleMeta<TMessageIds, TOptions>;
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

  for (const [key, message] of Object.entries(configOverwrite.meta.messages)) {
    (configOverwrite.meta.messages as any)[key] = `${message} (${docsUrl(
      config.name
    )})`;
  }

  return ESLintUtils.RuleCreator(docsUrl)(configOverwrite);
}
