/**
 * DO NOT EDIT
 * This file is generated
 */

import type { TSESLint } from '@typescript-eslint/utils';

export default (
  plugin: TSESLint.FlatConfig.Plugin,
  parser: TSESLint.FlatConfig.Parser
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
    name: 'ngrx/store',
    languageOptions: {
      parser,
    },
    rules: {
      '@ngrx/avoid-combining-selectors': 'error',
      '@ngrx/avoid-dispatching-multiple-actions-sequentially': 'error',
      '@ngrx/avoid-duplicate-actions-in-reducer': 'error',
      '@ngrx/avoid-mapping-selectors': 'error',
      '@ngrx/good-action-hygiene': 'error',
      '@ngrx/no-multiple-global-stores': 'error',
      '@ngrx/no-reducer-in-key-names': 'error',
      '@ngrx/no-store-subscription': 'error',
      '@ngrx/no-typed-global-store': 'error',
      '@ngrx/on-function-explicit-return-type': 'error',
      '@ngrx/prefer-action-creator-in-dispatch': 'error',
      '@ngrx/prefer-action-creator': 'error',
      '@ngrx/prefer-inline-action-props': 'error',
      '@ngrx/prefer-one-generic-in-create-for-feature-selector': 'error',
      '@ngrx/prefer-selector-in-select': 'error',
      '@ngrx/prefix-selectors-with-select': 'error',
      '@ngrx/select-style': 'error',
      '@ngrx/use-consistent-global-store-name': 'error',
    },
  },
];
