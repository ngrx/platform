import { defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.config.mts';

export default defineProject((config) =>
  mergeConfig(baseConfig, {
    root: __dirname,
    test: {
      name: 'effects',
      setupFiles: ['test-setup.ts'],
      include: ['spec/**/*.spec.ts'],
      coverage: {
        reportsDirectory: '../../coverage/modules/effects',
      },
    },
    define: {
      'import.meta.vitest': config.mode !== 'production',
    },
  })
);
