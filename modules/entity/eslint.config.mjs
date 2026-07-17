import tseslint from 'typescript-eslint';
import baseConfig, {
  angularTemplateConfig,
  angularTsConfig,
} from '../../eslint.config.mjs';

export default tseslint.config(
  {
    ignores: ['**/dist', '**/schematics-core/**/*.ts'],
  },
  baseConfig,
  {
    files: ['**/*.ts'],
    extends: [angularTsConfig],
    rules: {
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
    },
    languageOptions: {
      parserOptions: {
        project: ['modules/entity/tsconfig.*.json'],
      },
    },
  },
  {
    files: ['**/*.html'],
    extends: [angularTemplateConfig],
  }
);
