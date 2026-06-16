import tseslint from 'typescript-eslint';
import baseConfig, {
  angularTemplateConfig,
  angularTsConfig,
} from '../../eslint.config.mjs';

export default tseslint.config(
  {
    ignores: ['**/dist', '**/jest.config.ts', '**/schematics-core/**/*.ts'],
  },
  baseConfig,
  {
    files: ['**/*.ts'],
    extends: [angularTsConfig],
    rules: {
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      '@nx/enforce-module-boundaries': 'off',
      '@angular-eslint/prefer-inject': 'off',
    },
    languageOptions: {
      parserOptions: {
        project: ['modules/effects/tsconfig.*.json'],
      },
    },
  },
  {
    files: ['testing/**/*.ts'],
    extends: [angularTsConfig],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
    languageOptions: {
      parserOptions: {
        project: ['modules/effects/tsconfig.*.json'],
      },
    },
  },
  {
    files: ['**/*.html'],
    extends: [angularTemplateConfig],
  }
);
