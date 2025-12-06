/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  plugins: [angular(), nxViteTsPaths()],
  test: {
    name: 'Effects',
    globals: true,
    pool: 'forks',
    environment: 'jsdom',
    setupFiles: ['test-setup.ts'],
    include: ['spec/**/*.spec.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/modules/effects',
    },
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
