/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  plugins: [angular(), nxViteTsPaths()],
  test: {
    name: 'Example App',
    globals: true,
    pool: 'forks',
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    snapshotSerializers: [
      '../../node_modules/jest-preset-angular/build/serializers/html-comment',
      '../../node_modules/jest-preset-angular/build/serializers/ng-snapshot',
      '../../node_modules/jest-preset-angular/build/serializers/no-ng-attributes',
    ],
    coverage: {
      reportsDirectory: '../../coverage/projects/example-app',
    },
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
