import { defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.config.mts';

export default defineProject((config) =>
  mergeConfig(baseConfig, {
    root: __dirname,
    test: {
      name: 'example-app',
      setupFiles: ['src/test-setup.ts'],
    },
    define: {
      'import.meta.vitest': config.mode !== 'production',
    },
  })
);
