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
    },
    plugins: {
      '@ngrx': plugin,
    },
  },
  {
    name: 'ngrx/operators',
    languageOptions: {
      parser,
    },
    rules: {
      '@ngrx/prefer-concat-latest-from': 'error',
    },
  },
];
