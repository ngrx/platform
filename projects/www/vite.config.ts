/// <reference types="vitest" />
import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import ngrxStackblitzPlugin from './src/tools/vite-ngrx-stackblits.plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: `../../node_modules/.vite`,

    build: {
      outDir: '../../dist/projects/www/client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    server: {
      fs: {
        allow: ['.'],
      },
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    },
    plugins: [
      analog({
        vite: {
          inlineStylesExtension: 'scss',
        },
        apiPrefix: '/noop',
        nitro: {
          preset: 'firebase',
          firebase: {
            nodeVersion: '20',
            gen: 2,
            httpsOptions: {
              region: 'us-east1',
              maxInstances: 100,
            },
          },
        },
      }),
      nxViteTsPaths(),
      splitVendorChunkPlugin(),
      ngrxStackblitzPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
