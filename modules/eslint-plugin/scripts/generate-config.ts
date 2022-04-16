import { writeFileSync } from 'fs';
import { join } from 'path';
import { format, resolveConfig } from 'prettier';
import type { NgRxRuleModule } from '../src/rule-creator';
import { rules } from '../src/rules';

const prettierConfig = resolveConfig.sync(__dirname);

const RULE_MODULE = '@ngrx';
const CONFIG_DIRECTORY = './modules/eslint-plugin/src/configs/';

writeConfig(
  'recommended',
  (rule) =>
    !!rule.meta.docs?.recommended && !rule.meta.docs?.requiresTypeChecking
);

writeConfig('all', (rule) => !rule.meta.docs?.requiresTypeChecking);

writeConfig(
  'strict',
  (rule) => !rule.meta.docs?.requiresTypeChecking,
  () => 'error'
);

writeConfig(
  'recommended-requiring-type-checking',
  (rule) => !!rule.meta.docs?.recommended
);

writeConfig('all-requiring-type-checking', () => true);

writeConfig(
  'strict-requiring-type-checking',
  () => true,
  () => 'error'
);

writeConfig(
  'store',
  (rule) =>
    rule.meta.ngrxModule === 'store' && !rule.meta.docs?.requiresTypeChecking
);

writeConfig(
  'store-strict',
  (rule) =>
    rule.meta.ngrxModule === 'store' && !rule.meta.docs?.requiresTypeChecking,
  () => 'error'
);

writeConfig(
  'effects',
  (rule) =>
    rule.meta.ngrxModule === 'effects' && !rule.meta.docs?.requiresTypeChecking
);

writeConfig(
  'effects-strict',
  (rule) =>
    rule.meta.ngrxModule === 'effects' && !rule.meta.docs?.requiresTypeChecking,
  () => 'error'
);

writeConfig(
  'effects-requiring-type-checking',
  (rule) => rule.meta.ngrxModule === 'effects'
);

writeConfig(
  'effects-strict-requiring-type-checking',
  (rule) => rule.meta.ngrxModule === 'effects',
  () => 'error'
);

writeConfig(
  'component-store',
  (rule) =>
    rule.meta.ngrxModule === 'component-store' &&
    !rule.meta.docs?.requiresTypeChecking
);

writeConfig(
  'component-store-strict',
  (rule) =>
    rule.meta.ngrxModule === 'component-store' &&
    !rule.meta.docs?.requiresTypeChecking,
  () => 'error'
);

function writeConfig(
  configName:
    | 'all'
    | 'recommended'
    | 'strict'
    | 'all-requiring-type-checking'
    | 'recommended-requiring-type-checking'
    | 'strict-requiring-type-checking'
    | 'store'
    | 'store-strict'
    | 'effects'
    | 'effects-requiring-type-checking'
    | 'effects-strict'
    | 'effects-strict-requiring-type-checking'
    | 'component-store'
    | 'component-store-strict',
  predicate: (rule: NgRxRuleModule<[], string>) => boolean,
  setting = (rule: NgRxRuleModule<[], string>) =>
    rule.meta.docs?.recommended || 'warn'
) {
  const rulesForConfig = Object.entries(rules).filter(([_, rule]) =>
    predicate(rule)
  );
  const configRules = rulesForConfig.reduce<Record<string, string>>(
    (rules, [ruleName, rule]) => {
      rules[`${RULE_MODULE}/${ruleName}`] = setting(rule);
      return rules;
    },
    {}
  );
  const parserOptions: null | Record<string, string | number> =
    rulesForConfig.some(([_, rule]) => rule.meta.docs?.requiresTypeChecking)
      ? {
          ecmaVersion: 2020,
          sourceType: 'module',
          project: './tsconfig.json',
        }
      : null;

  const code = `
/**
 * DO NOT EDIT
 * This file is generated
 */

export = {
  parser: "@typescript-eslint/parser",
  ${parserOptions ? `parserOptions: ${JSON.stringify(parserOptions)},` : ''}
  plugins: ["${RULE_MODULE}"],
  rules: ${JSON.stringify(configRules)},
}
`;
  const config = format(code, {
    parser: 'typescript',
    ...prettierConfig,
  });
  writeFileSync(join(CONFIG_DIRECTORY, `${configName}.ts`), config);
}
