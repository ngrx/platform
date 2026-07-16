import { defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.config.mts';

export default defineProject((config) =>
  mergeConfig(baseConfig, {
    root: __dirname,
    test: {
      name: 'eslint-plugin',
      testTimeout: 8000,
      typecheck: {
        exclude: ['spec/rules/**/*.{spec,test}.ts'],
      },
    },
    define: {
      'import.meta.vitest': config.mode !== 'production',
    },
  })
);
