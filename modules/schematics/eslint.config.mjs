import tseslint from 'typescript-eslint';
import baseConfig, {
  angularTemplateConfig,
  angularTsConfig,
} from '../../eslint.config.mjs';

export default tseslint.config(
  {
    ignores: ['**/dist'],
  },
  baseConfig,
  {
    files: ['**/*.ts'],
    extends: [angularTsConfig],
    rules: {
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/component-selector': 'off',
    },
    languageOptions: {
      parserOptions: {
        project: ['modules/schematics/tsconfig.*.json'],
      },
    },
  },
  {
    files: ['**/*.html'],
    extends: [angularTemplateConfig],
  },
  {
    ignores: ['schematics-core'],
  }
);
