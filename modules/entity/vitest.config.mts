import { defineProject, mergeConfig, configDefaults } from 'vitest/config';
import { baseConfig } from '../../vitest.config.mts';

export default defineProject((config) =>
  mergeConfig(baseConfig, {
    root: __dirname,
    test: {
      name: 'entity',
      setupFiles: ['test-setup.ts'],
      exclude: [
        ...configDefaults.exclude,
        '**/migrations/**',
        '**/schematics/**',
      ],
    },
    define: {
      'import.meta.vitest': config.mode !== 'production',
    },
  })
);
