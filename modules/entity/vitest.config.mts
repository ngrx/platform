import { defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.config.mts';

export default defineProject((config) =>
  mergeConfig(baseConfig, {
    root: __dirname,
    test: {
      name: 'entity',
      include: ['spec/**/*.spec.ts'],
      typecheck: {
        include: ['spec/**/*.spec.ts', '**/*.test-d.ts'],
      },
    },
    define: {
      'import.meta.vitest': config.mode !== 'production',
    },
  })
);
