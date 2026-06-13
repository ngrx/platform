import { defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.config.mts';

export default defineProject((config) =>
  mergeConfig(baseConfig, {
    root: __dirname,
    test: {
      name: 'effects',
      include: ['spec/**/*.spec.ts'],
    },
    define: {
      'import.meta.vitest': config.mode !== 'production',
    },
  })
);
