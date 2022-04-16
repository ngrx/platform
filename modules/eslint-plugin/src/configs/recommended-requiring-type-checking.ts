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
    '@ngrx/updater-explicit-return-type': 'warn',
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
    '@ngrx/avoid-combining-selectors': 'warn',
    '@ngrx/avoid-dispatching-multiple-actions-sequentially': 'warn',
    '@ngrx/avoid-duplicate-actions-in-reducer': 'warn',
    '@ngrx/avoid-mapping-selectors': 'warn',
    '@ngrx/good-action-hygiene': 'warn',
    '@ngrx/no-multiple-global-stores': 'warn',
    '@ngrx/no-reducer-in-key-names': 'warn',
    '@ngrx/no-store-subscription': 'warn',
    '@ngrx/no-typed-global-store': 'warn',
    '@ngrx/on-function-explicit-return-type': 'warn',
    '@ngrx/prefer-action-creator-in-dispatch': 'warn',
    '@ngrx/prefer-action-creator': 'warn',
    '@ngrx/prefer-inline-action-props': 'warn',
    '@ngrx/prefer-one-generic-in-create-for-feature-selector': 'warn',
    '@ngrx/prefer-selector-in-select': 'warn',
    '@ngrx/prefix-selectors-with-select': 'warn',
    '@ngrx/select-style': 'warn',
    '@ngrx/use-consistent-global-store-name': 'warn',
  },
};
