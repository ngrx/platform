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
    name: 'ngrx/signals',
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      '@ngrx/signal-state-no-arrays-at-root-level': 'error',
      '@ngrx/with-state-no-arrays-at-root-level': 'error',
    },
  },
];
