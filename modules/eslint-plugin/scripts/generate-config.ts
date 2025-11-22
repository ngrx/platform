import { writeFileSync } from 'fs';
import { join } from 'path';
import { format, resolveConfig } from 'prettier';
import { rulesForGenerate } from '../src/utils/helper-functions/rules';
import { NgRxRule } from '../src/rule-creator';

(async () => {
  const prettierConfig = await resolveConfig(__dirname);
  const RULE_MODULE = '@ngrx';
  const CONFIG_DIRECTORY = './modules/eslint-plugin/src/configs/';

  const isModule = (rule: NgRxRule, moduleName: string) =>
    rule.meta.docs?.ngrxModule === moduleName;
  const isTypeChecked = (rule: NgRxRule) =>
    rule.meta.docs?.requiresTypeChecking === true;

  writeConfig('all', (rule) => !isTypeChecked(rule));
  writeConfig('allTypeChecked', (_rule) => true);

  writeConfig(
    'store',
    (rule) => isModule(rule, 'store') && !isTypeChecked(rule)
  );

  writeConfig(
    'effects',
    (rule) => isModule(rule, 'effects') && !isTypeChecked(rule)
  );
  writeConfig('effectsTypeChecked', (rule) => isModule(rule, 'effects'));

  writeConfig(
    'component-store',
    (rule) => isModule(rule, 'component-store') && !isTypeChecked(rule)
  );

  writeConfig(
    'operators',
    (rule) => isModule(rule, 'operators') && !isTypeChecked(rule)
  );

  writeConfig(
    'signals',
    (rule) => isModule(rule, 'signals') && !isTypeChecked(rule)
  );
  writeConfig('signalsTypeChecked', (rule) => isModule(rule, 'signals'));

  async function writeConfig(
    configName:
      | 'all'
      | 'allTypeChecked'
      | 'store'
      | 'effects'
      | 'effectsTypeChecked'
      | 'component-store'
      | 'operators'
      | 'signals'
      | 'signalsTypeChecked',
    predicate: (rule: NgRxRule) => boolean
  ) {
    const rulesForConfig = Object.entries(rulesForGenerate).filter(
      ([_, rule]) => predicate(rule)
    );
    const configRules = rulesForConfig.reduce<Record<string, string>>(
      (rules, [ruleName, _rule]) => {
        rules[`${RULE_MODULE}/${ruleName}`] = 'error';
        return rules;
      },
      {}
    );

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
          },
          plugins: {
            '@ngrx': plugin,
          },
        },
        {
          name: 'ngrx/${configName}',
          languageOptions: {
            parser,
          },
          rules: ${JSON.stringify(configRules, null, 2)}
        },
      ];`;
    const tsConfigFormatted = await format(tsCode, {
      parser: 'typescript',
      ...prettierConfig,
    });
    writeFileSync(
      join(CONFIG_DIRECTORY, `${configName}.ts`),
      tsConfigFormatted
    );

    const jsonConfig: { [key: string]: any } = {
      parser: '@typescript-eslint/parser',
      plugins: ['@ngrx'],
      rules: configRules,
    };
    const jsonConfigFormatted = await format(
      JSON.stringify(jsonConfig, null, 2),
      {
        parser: 'json',
        ...prettierConfig,
      }
    );

    writeFileSync(
      join(CONFIG_DIRECTORY, `${configName}.json`),
      jsonConfigFormatted
    );
  }
})();
