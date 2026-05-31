import { configDefaults, defineProject, mergeConfig } from 'vitest/config';
import { baseConfig } from '../../vitest.config.mts';

export default defineProject((config) =>
  mergeConfig(baseConfig, {
    root: __dirname,
    test: {
      name: 'eslint-plugin',
      setupFiles: ['test-setup.ts'],
      testTimeout: 8000,
      exclude: [...configDefaults.exclude, 'spec/schematics/**'],
      server: {
        deps: {
          inline: ['strip-json-comments'],
        },
      },
    },
    define: {
      'import.meta.vitest': config.mode !== 'production',
    },
  })
);
