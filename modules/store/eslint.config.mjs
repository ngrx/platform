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
    ignores: ['**/dist', '**/jest.config.ts', '**/schematics-core/test-setup.ts'],
  },
  ...baseConfig,
  ...compat
    .config({
      extends: [
        'plugin:@nx/angular',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      plugins: ['@typescript-eslint'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts'],
      rules: {
        ...config.rules,
        '@angular-eslint/directive-selector': 'off',
        '@angular-eslint/component-selector': 'off',
        '@angular-eslint/prefer-standalone': 'off',
      },
      languageOptions: {
        parserOptions: {
          project: ['modules/store/tsconfig.*.json'],
        },
      },
    })),
  ...compat
    .config({
      extends: [
        'plugin:@nx/angular',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      plugins: ['@typescript-eslint'],
    })
    .map((config) => ({
      ...config,
      files: ['testing/**/*.ts'],
      rules: {
        ...config.rules,
        '@nx/enforce-module-boundaries': 'off',
      },
      languageOptions: {
        parserOptions: {
          project: ['modules/store/testing/tsconfig.*.json'],
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
  {
    ignores: ['schematics-core'],
  },
];
