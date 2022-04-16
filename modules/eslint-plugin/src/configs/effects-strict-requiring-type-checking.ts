/**
 * DO NOT EDIT
 * This file is generated
 */

export = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@ngrx'],
  rules: {
    '@ngrx/avoid-cyclic-effects': 'error',
    '@ngrx/no-dispatch-in-effects': 'error',
    '@ngrx/no-effect-decorator-and-creator': 'error',
    '@ngrx/no-effect-decorator': 'error',
    '@ngrx/no-effects-in-providers': 'error',
    '@ngrx/no-multiple-actions-in-effects': 'error',
    '@ngrx/prefer-action-creator-in-of-type': 'error',
    '@ngrx/prefer-concat-latest-from': 'error',
    '@ngrx/prefer-effect-callback-in-block-statement': 'error',
    '@ngrx/use-effects-lifecycle-interface': 'error',
  },
};
