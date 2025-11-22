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
    name: 'ngrx/effects',
    languageOptions: {
      parser,
    },
    rules: {
      '@ngrx/no-dispatch-in-effects': 'error',
      '@ngrx/no-effects-in-providers': 'error',
      '@ngrx/prefer-action-creator-in-of-type': 'error',
      '@ngrx/prefer-effect-callback-in-block-statement': 'error',
      '@ngrx/use-effects-lifecycle-interface': 'error',
    },
  },
];
