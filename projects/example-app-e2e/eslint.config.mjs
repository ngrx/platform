import baseConfig from '../../eslint.config.mjs';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import cypressPlugin from 'eslint-plugin-cypress';

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
        project: 'projects/example-app-e2e/tsconfig.*.json',
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
    rules: {},
  },
];
