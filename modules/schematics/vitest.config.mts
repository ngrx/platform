import { defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.config.mts';

export default defineProject((config) =>
  mergeConfig(baseConfig, {
    root: __dirname,
    test: {
      name: 'schematics',
      setupFiles: ['test-setup.ts'],
      include: ['src/**/*.spec.ts'],
    },
    define: {
      'import.meta.vitest': config.mode !== 'production',
    },
  })
);
