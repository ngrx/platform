import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vitest/config';

/**
 * Shared project configuration object.
 * Projects should merge this into their local 'defineProject' call.
 */
export const baseConfig = {
  plugins: [angular(), nxViteTsPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    passWithNoTests: true,
    typecheck: {
      enabled: true,
      ignoreSourceErrors: true,
      include: ['**/*.test-d.ts'],
      tsconfig: './tsconfig.spec.json',
    },
  },
};

/**
 * Root Vitest configuration.
 * Delegates to the individual project configuration files.
 */
export default defineConfig({
  test: {
    projects: ['modules/*/vitest.config.mts', 'projects/*/vitest.config.mts'],
  },
});
