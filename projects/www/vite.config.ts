/// <reference types="vitest" />
import analog from '@analogjs/platform';
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import ngrxStackblitzPlugin from './src/tools/vite-ngrx-stackblits.plugin';
import angular from '@analogjs/vite-plugin-angular';
import { ngrxTheme } from './src/shared/ngrx-shiki-theme';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    cacheDir: `../../node_modules/.vite`,

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
      reporters: ['default'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
