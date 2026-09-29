import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const workspaceRoot = dirname(fileURLToPath(import.meta.url));

/**
 * Shared project configuration object.
 * Projects should merge this into their local 'defineProject' call.
 */
export const baseConfig = {
  plugins: [
    angular(),
    // The workspace root tsconfig holds the path aliases for all projects,
    // so resolve it explicitly instead of crawling each project root.
    tsconfigPaths({ projects: [join(workspaceRoot, 'tsconfig.json')] }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'forks',
    include: ['**/*.{spec,test}.ts'],
    passWithNoTests: true,
    setupFiles: ['test-setup.ts'],
    typecheck: {
      enabled: true,
      ignoreSourceErrors: true,
      include: ['**/*.{spec,test}.ts', '**/*.test-d.ts'],
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
    projects: [
      'modules/*/vitest.config.mts',
      'projects/example-app/vitest.config.mts',
      'projects/standalone-app/vitest.config.mts',
    ],
  },
});
