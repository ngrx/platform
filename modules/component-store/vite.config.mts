/// <reference types="vitest" />

import angular from '@analogjs/vite-plugin-angular';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    plugins: [angular(), nxViteTsPaths()],
    test: {
      globals: true,
      pool: 'forks',
      environment: 'jsdom',
      setupFiles: ['test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
      snapshotSerializers: [
        'jest-preset-angular/build/serializers/html-comment',
        'jest-preset-angular/build/serializers/ng-snapshot',
        'jest-preset-angular/build/serializers/no-ng-attributes',
      ],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
