import { writeFileSync } from 'fs';
import { join } from 'path';
import { format, resolveConfig } from 'prettier';
import { rulesForGenerate } from '../src/utils/helper-functions/rules';
import { NgRxRule } from '../src/rule-creator';

const prettierConfig = resolveConfig.sync(__dirname);

const RULE_MODULE = '@ngrx';
const CONFIG_DIRECTORY = './modules/eslint-plugin/src/configs/';

writeConfig('all', (_rule) => true);
writeConfig('store', (rule) => rule.meta.docs?.ngrxModule === 'store');
writeConfig('effects', (rule) => rule.meta.docs?.ngrxModule === 'effects');
writeConfig(
  'component-store',
  (rule) => rule.meta.docs?.ngrxModule === 'component-store'
);
writeConfig('operators', (rule) => rule.meta.docs?.ngrxModule === 'operators');
writeConfig('signals', (rule) => rule.meta.docs?.ngrxModule === 'signals');

function writeConfig(
  configName:
    | 'all'
    | 'store'
    | 'effects'
    | 'component-store'
    | 'operators'
    | 'signals',
  predicate: (rule: NgRxRule) => boolean
) {
  const rulesForConfig = Object.entries(rulesForGenerate).filter(([_, rule]) =>
    predicate(rule)
  );
  const configRules = rulesForConfig.reduce<Record<string, string>>(
    (rules, [ruleName, _rule]) => {
      rules[`${RULE_MODULE}/${ruleName}`] = 'error';
      return rules;
    },
    {}
  );
  const requireParserOptions: null | Record<string, string | number> =
    rulesForConfig.some(([_, rule]) => rule.meta.docs?.requiresTypeChecking)
      ? {
          ecmaVersion: 2020,
          sourceType: 'module',
          project: './tsconfig.json',
        }
      : null;

  const tsCode = `
    /**
   * DO NOT EDIT
   * This file is generated
   */

    import type { TSESLint } from '@typescript-eslint/utils';

    export default (
      plugin: TSESLint.FlatConfig.Plugin,
      parser: TSESLint.FlatConfig.Parser,
    ): TSESLint.FlatConfig.ConfigArray => [
      {
        name: 'ngrx/base',
        languageOptions: {
          parser,
          sourceType: 'module',
        },
        plugins: {
          '@ngrx': plugin,
        },
      },
      {
        name: 'ngrx/${configName}',
        languageOptions: {
          parser,
          ${
            requireParserOptions
              ? `parserOptions: ${JSON.stringify(
                  requireParserOptions,
                  null,
                  2
                )},`
              : ''
          }
        },
        rules: ${JSON.stringify(configRules, null, 2)}
      },
    ];`;
  const tsConfigFormatted = format(tsCode, {
    parser: 'typescript',
    ...prettierConfig,
  });
  writeFileSync(join(CONFIG_DIRECTORY, `${configName}.ts`), tsConfigFormatted);

  const jsonConfig: { [key: string]: any } = {
    parser: '@typescript-eslint/parser',
    plugins: ['@ngrx'],
    rules: configRules,
  };
  if (requireParserOptions) {
    jsonConfig.parserOptions = {
      ecmaVersion: 2020,
      sourceType: 'module',
      project: './tsconfig.json',
    };
  }
  const jsonConfigFormatted = format(JSON.stringify(jsonConfig, null, 2), {
    parser: 'json',
    ...prettierConfig,
  });

  writeFileSync(
    join(CONFIG_DIRECTORY, `${configName}.json`),
    jsonConfigFormatted
  );
}
