import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import baseConfig from '../../eslint.config.mjs';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import cypressPlugin from 'eslint-plugin-cypress';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/dist'],
  },
  ...baseConfig,

  {
    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
      cypress: cypressPlugin,
    },
  },
  {
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
    languageOptions: {
      parserOptions: {
        project: 'projects/example-app-e2e/tsconfig.*?.json',
      },
    },
  },
  {
    files: ['src/plugins/index.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off',
    },
  },
  {
    ignores: ['schematics-core'],
  },

  // ✅ Cypress E2E overrides
  {
    files: ['src/**/*.cy.{ts,tsx}'],
    plugins: {
      cypress: cypressPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      // Disable broken rule under ESLint v9
      'cypress/no-async-tests': 'off',
      // Add other Cypress rules manually if needed
    },
  },
];
