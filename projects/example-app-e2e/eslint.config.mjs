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
    ignores: ['**/dist', '**/environment.prod.ts'],
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
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'bc',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'bc',
            style: 'kebab-case',
          },
        ],
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@nx/enforce-module-boundaries': 'off',
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
        'no-redeclare': 'error',
        'no-underscore-dangle': 'error',
        'no-var': 'error',
        'no-case-declarations': 'off',
        '@angular-eslint/prefer-standalone': 'off',
      },
      languageOptions: {
        parserOptions: {
          project: ['projects/example-app-e2e/tsconfig.*.json'],
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
    files: ['src/**/*.cy.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['projects/example-app-e2e/tsconfig.*.json'],
      },
      globals: {
        cy: true,
        describe: true,
        it: true,
        before: true,
        beforeEach: true,
        after: true,
        afterEach: true,
      },
    },
    rules: {
      // Add optional Cypress-safe tweaks
      'no-unused-expressions': 'off', // Allow Chai-style assertions
      '@typescript-eslint/no-floating-promises': 'off', // Often triggered by cy.* commands
    },
  },
];
