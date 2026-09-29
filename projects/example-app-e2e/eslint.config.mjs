import tseslint from 'typescript-eslint';
import baseConfig, {
  angularTemplateConfig,
  angularTsConfig,
} from '../../eslint.config.mjs';

export default tseslint.config(
  {
    ignores: ['**/dist', '**/environment.prod.ts'],
  },
  baseConfig,

  {
    files: ['**/*.ts'],
    extends: [angularTsConfig],
    rules: {
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
      '@angular-eslint/prefer-inject': 'off',
    },
    languageOptions: {
      parserOptions: {
        project: ['projects/example-app-e2e/tsconfig.*.json'],
      },
    },
  },

  {
    files: ['**/*.html'],
    extends: [angularTemplateConfig],
  }
);
