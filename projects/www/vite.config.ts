/// <reference types="vitest" />
import analog from '@analogjs/platform';
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import ngrxStackblitzPlugin from './src/tools/vite-ngrx-stackblits.plugin';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite',
  build: {
    outDir: '../../dist/projects/www/client',
    reportCompressedSize: true,
    target: ['es2020'],
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          return undefined;
        },
      },
    },
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
      static: true,
      content: {
        highlighter: 'shiki',
        shikiOptions: {
          highlighter: {
            additionalLangs: ['sh'],
          },
        },
      },
    }),
    angular({
      inlineStylesExtension: 'scss',
    }),
    nxViteTsPaths(),
    ngrxStackblitzPlugin(),
  ],
  test: {
    pool: 'threads',
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
