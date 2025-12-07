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
    name: 'ngrx/signals',
    languageOptions: {
      parser,
    },
    rules: {
      '@ngrx/enforce-type-call': 'error',
      '@ngrx/prefer-protected-state': 'error',
      '@ngrx/signal-state-no-arrays-at-root-level': 'error',
      '@ngrx/signal-store-feature-should-use-generic-type': 'error',
    },
  },
];
