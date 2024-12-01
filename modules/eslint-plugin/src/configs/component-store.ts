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
    name: 'ngrx/component-store',
    languageOptions: {
      parser,
    },
    rules: {
      '@ngrx/avoid-combining-component-store-selectors': 'error',
      '@ngrx/avoid-mapping-component-store-selectors': 'error',
      '@ngrx/require-super-ondestroy': 'error',
      '@ngrx/updater-explicit-return-type': 'error',
    },
  },
];
