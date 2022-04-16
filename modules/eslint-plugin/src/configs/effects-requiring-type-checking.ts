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
    '@ngrx/avoid-cyclic-effects': 'warn',
    '@ngrx/no-dispatch-in-effects': 'warn',
    '@ngrx/no-effect-decorator-and-creator': 'error',
    '@ngrx/no-effect-decorator': 'warn',
    '@ngrx/no-effects-in-providers': 'error',
    '@ngrx/no-multiple-actions-in-effects': 'warn',
    '@ngrx/prefer-action-creator-in-of-type': 'warn',
    '@ngrx/prefer-concat-latest-from': 'warn',
    '@ngrx/prefer-effect-callback-in-block-statement': 'warn',
    '@ngrx/use-effects-lifecycle-interface': 'warn',
  },
};
