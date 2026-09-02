/// <reference types="vitest" />
import { defaultClientConditions, defaultServerConditions } from 'vite';
import { defineConfig } from 'vitest/config';
import analog from '@analogjs/platform';
import tsconfigPaths from 'vite-tsconfig-paths';
import ngrxStackblitzPlugin from './src/tools/vite-ngrx-stackblitz.plugin';
import { ngrxTheme, ngrxThemeLight } from './src/shared/ngrx-shiki-theme';
import { configDefaults } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const wwwRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  root: wwwRoot,
  cacheDir: '../../node_modules/.vite/www',

  resolve: {
    conditions: [...defaultClientConditions],
    alias: {
      // Trailing slash required for subpath imports (e.g. @ngrx-io/app/...).
      '@ngrx-io/': join(wwwRoot, 'src/'),
    },
  },

  ssr: {
    resolve: {
      conditions: [...defaultServerConditions],
    },
  },

  build: {
    outDir: '../../dist/projects/www/client',
    reportCompressedSize: true,
    target: 'es2020',
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
          highlight: {
            themes: { light: 'ngrx-theme-light', dark: 'ngrx-theme' },
            defaultColor: 'dark',
          },
          highlighter: {
            additionalLangs: ['sh'],
            themes: [ngrxTheme, ngrxThemeLight],
          },
        },
      },
      vite: {
        inlineStylesExtension: 'scss',
      },
    }),
    // The workspace root tsconfig holds the path aliases for all projects,
    // so resolve it explicitly instead of crawling the project root.
    tsconfigPaths({ projects: [join(wwwRoot, '../../tsconfig.json')] }),
    ngrxStackblitzPlugin(),
  ],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    exclude: [...configDefaults.exclude, 'src/app/examples/**'],
    typecheck: {
      enabled: true,
      ignoreSourceErrors: true,
      include: ['**/*.spec.ts', '**/*.test-d.ts'],
      exclude: [...configDefaults.exclude, 'src/app/examples/**'],
      tsconfig: './tsconfig.spec.json',
    },
  },

  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
