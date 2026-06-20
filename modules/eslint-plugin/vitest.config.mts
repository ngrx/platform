import { defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.config.mts';

export default defineProject((config) =>
  mergeConfig(baseConfig, {
    root: __dirname,
    test: {
      name: 'eslint-plugin',
      testTimeout: 8000,
      typecheck: {
        include: ['spec/types/**/*.{spec,test}.ts', '**/*.test-d.ts'],
      },
    },
    define: {
      'import.meta.vitest': config.mode !== 'production',
    },
  })
);
