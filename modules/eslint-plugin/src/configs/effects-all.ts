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
    name: 'ngrx/effects-all',
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      '@ngrx/avoid-cyclic-effects': 'error',
      '@ngrx/no-dispatch-in-effects': 'error',
      '@ngrx/no-effects-in-providers': 'error',
      '@ngrx/no-multiple-actions-in-effects': 'error',
      '@ngrx/prefer-action-creator-in-of-type': 'error',
      '@ngrx/prefer-effect-callback-in-block-statement': 'error',
      '@ngrx/use-effects-lifecycle-interface': 'error',
    },
  },
];
