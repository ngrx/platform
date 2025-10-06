import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import baseConfig from '../../eslint.config.mjs';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/dist', '**/schematics-core/**/*.ts'],
  },
  ...baseConfig,
  ...compat
    .config({
      extends: [
        'plugin:@nx/angular',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      plugins: [
        'eslint-plugin-import',
        '@angular-eslint/eslint-plugin',
        '@typescript-eslint',
      ],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts'],
      rules: {
        ...config.rules,
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: ['aio', 'ngrx'],
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: ['aio', 'ngrx'],
            style: 'kebab-case',
          },
        ],
        '@angular-eslint/component-class-suffix': 'error',
        '@angular-eslint/directive-class-suffix': 'error',
        '@angular-eslint/no-input-rename': 'off',
        '@angular-eslint/no-output-rename': 'off',
        '@angular-eslint/no-output-on-prefix': 'off',
        '@angular-eslint/no-output-native': 'off',
        '@angular-eslint/use-pipe-transform-interface': 'error',
        '@angular-eslint/prefer-inject': 'off',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
          'off',
          {
            accessibility: 'explicit',
          },
        ],
        '@typescript-eslint/member-delimiter-style': [
          'off',
          {
            multiline: {
              delimiter: 'none',
              requireLast: true,
            },
            singleline: {
              delimiter: 'semi',
              requireLast: false,
            },
          },
        ],
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-shadow': [
          'error',
          {
            hoist: 'all',
          },
        ],
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/semi': ['off', null],
        '@typescript-eslint/unified-signatures': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'brace-style': ['error', '1tbs'],
        curly: 'error',
        'eol-last': 'error',
        eqeqeq: ['error', 'smart'],
        'guard-for-in': 'error',
        'id-blacklist': 'off',
        'id-match': 'off',
        'import/no-deprecated': 'warn',
        'max-len': [
          'error',
          {
            code: 160,
          },
        ],
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-console': [
          'error',
          {
            allow: [
              'log',
              'warn',
              'dir',
              'timeLog',
              'assert',
              'clear',
              'count',
              'countReset',
              'group',
              'groupEnd',
              'table',
              'dirxml',
              'error',
              'groupCollapsed',
              'Console',
              'profile',
              'profileEnd',
              'timeStamp',
              'context',
            ],
          },
        ],
        'no-debugger': 'error',
        'no-empty': 'off',
        'no-eval': 'error',
        'no-fallthrough': 'error',
        'no-new-wrappers': 'error',
        'no-redeclare': 'error',
        'no-restricted-imports': 'error',
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-underscore-dangle': 'off',
        'no-unused-labels': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        radix: 'error',
        'spaced-comment': [
          'error',
          'always',
          {
            markers: ['/'],
          },
        ],
        'no-prototype-builtins': 'off',
        '@angular-eslint/prefer-standalone': 'off',
        '@angular-eslint/prefer-inject': 'off',
        '@nx/enforce-module-boundaries': 'off',
      },
      languageOptions: {
        parserOptions: {
          project: ['projects/ngrx.io/tsconfig.*?.json'],
        },
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/angular-template'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.html'],
      rules: {
        ...config.rules,
      },
    })),
];
