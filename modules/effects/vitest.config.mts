import { configDefaults, defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.config.mts';

export default defineProject((config) =>
  mergeConfig(baseConfig, {
    root: __dirname,
    test: {
      name: 'effects',
      setupFiles: ['test-setup.ts'],
      exclude: [
        ...configDefaults.exclude,
        '**/migrations/**',
        '**/schematics/**',
        '**/testing/**',
      ],
      coverage: {
        reportsDirectory: '../../coverage/modules/effects',
      },
      testTimeout: 15000,
    },
    define: {
      'import.meta.vitest': config.mode !== 'production',
    },
  })
);
