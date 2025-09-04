/// <reference types="vitest" />
import {
  defineConfig,
  defaultClientConditions,
  defaultServerConditions,
} from 'vite';
import analog from '@analogjs/platform';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import ngrxStackblitzPlugin from './src/tools/vite-ngrx-stackblits.plugin';
import { ngrxTheme } from './src/shared/ngrx-shiki-theme';
import { configDefaults } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/www',

  resolve: {
    conditions: [...defaultClientConditions],
  },

  ssr: {
    resolve: {
      conditions: [...defaultServerConditions],
    },
  },

  build: {
    outDir: '../../dist/projects/www/client',
    reportCompressedSize: true,
    target: 'es2016',
    rollupOptions: {
      output: {
        manualChunks(id) {
          return id.includes('node_modules') ? 'vendor' : undefined;
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
    angular({
      inlineStylesExtension: 'scss',
    }),
    analog({
      static: true,
      content: {
        highlighter: 'shiki',
        shikiOptions: {
          highlight: {
            theme: 'ngrx-theme',
          },
          highlighter: {
            additionalLangs: ['sh'],
            themes: [ngrxTheme],
          },
        },
      },
    }),
    nxViteTsPaths(),
    ngrxStackblitzPlugin(),
  ],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    exclude: [...configDefaults.exclude, 'src/app/examples/**'],
    reporters: ['default'],
  },

  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
