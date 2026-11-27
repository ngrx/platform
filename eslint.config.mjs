import nxEslintPlugin from '@nx/eslint-plugin';
import angularEslint from 'angular-eslint';
import tseslint from 'typescript-eslint';

export const angularTsConfig = tseslint.config(
  nxEslintPlugin.configs['flat/angular'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
    },
  }
);

export const angularTemplateConfig = angularEslint.configs.templateRecommended;

export default tseslint.config(
  {
    ignores: ['**/dist'],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
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
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
    extends: [nxEslintPlugin.configs['flat/typescript']],
    rules: {
      'no-extra-semi': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    extends: [nxEslintPlugin.configs['flat/javascript']],
    rules: {
      'no-extra-semi': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-object-type': [
        'warn',
        { allowObjectTypes: 'always' },
      ],
      '@typescript-eslint/no-empty-interface': 'off',
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
  },
  {
    files: ['**/spec/**', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  }
);
