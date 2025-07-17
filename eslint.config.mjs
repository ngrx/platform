// @ts-check
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  // @ts-ignore
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/dist'],
  },
  { plugins: { '@nx': nxEslintPlugin } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/no-inferrable-types': 'warn',
    },
  },
  ...compat
    .config({
      extends: ['plugin:@nx/typescript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
      rules: {
        ...config.rules,
        'no-extra-semi': 'off',
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/javascript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
      rules: {
        ...config.rules,
        'no-extra-semi': 'off',
      },
    })),
  ...compat
    .config({
      plugins: ['eslint-plugin-import', '@typescript-eslint'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts'],
      rules: {
        ...config.rules,
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/no-empty-object-type': 'warn',
        eqeqeq: ['off', 'smart'],
        'id-blacklist': [
          'error',
          'any',
          'Number',
          'number',
          'String',
          'string',
          'Boolean',
          'boolean',
          'Undefined',
          'undefined',
        ],
        'id-match': 'error',
        'no-eval': 'off',
        'no-redeclare': 'off',
        'no-underscore-dangle': 'off',
        'no-var': 'error',
        'no-prototype-builtins': 'off',
        '@typescript-eslint/no-wrapper-object-types': 'off',
        '@typescript-eslint/no-unsafe-function-type': 'off',
      },
    })),
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
