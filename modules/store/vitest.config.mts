import { defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.config.mts';

export default defineProject((config) =>
  mergeConfig(baseConfig, {
    root: __dirname,
    test: {
      name: 'store',
      setupFiles: ['test-setup.ts'],
    },
    define: {
      'import.meta.vitest': config.mode !== 'production',
    },
  })
);
