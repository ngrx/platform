import { Plugin } from 'vite';
import { parse as parseYaml } from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

export interface StackblitzConfig {
  name: string;
  description: string;
  open: string;
  extends?: string;
  files: Record<string, string>;
}

const EMPTY_CONFIG: StackblitzConfig = {
  name: '',
  description: '',
  open: 'app/main.ts',
  files: {},
};

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8')
);

const NGRX_VERSION = packageJson.version;
const ANGULAR_VERSION = packageJson.dependencies['@angular/core'];
const RXJS_VERSION = packageJson.dependencies['rxjs'];
const ZONE_JS_VERSION = packageJson.dependencies['zone.js'];
const TYPESCRIPT_VERSION = packageJson.devDependencies['typescript'];

export default function ngrxStackblitzPlugin(): Plugin {
  function resolveFiles(
    id: string,
    files: Record<string, string>
  ): Record<string, string> {
    return Object.keys(files).reduce(
      (acc, file) => {
        const filePath = path.resolve(path.dirname(id), files[file]);
        const content = fs.readFileSync(filePath, 'utf-8');

        if (file === 'package.json') {
          acc[file] = content
            .replaceAll('<angular-version>', ANGULAR_VERSION)
            .replaceAll('<rxjs-version>', RXJS_VERSION)
            .replaceAll('<zone-js-version>', ZONE_JS_VERSION)
            .replaceAll('<ngrx-version>', NGRX_VERSION)
            .replaceAll('<typescript-version>', TYPESCRIPT_VERSION);

          return acc;
        }

        acc[file] = content;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  function getBaseConfig(
    id: string,
    config: StackblitzConfig
  ): StackblitzConfig {
    if (!config.extends) {
      return EMPTY_CONFIG;
    }

    const pathToBase = path.resolve(path.dirname(id), config.extends);
    const baseContents = fs.readFileSync(pathToBase, 'utf-8');
    const base = parseYaml(baseContents) as StackblitzConfig;
    const baseFiles = resolveFiles(pathToBase, base.files);

    return {
      ...base,
      files: baseFiles,
    };
  }

  function loadConfig(id: string, config: StackblitzConfig): StackblitzConfig {
    const base = getBaseConfig(id, config);

    return {
      ...base,
      ...config,
      files: {
        ...base.files,
        ...resolveFiles(id, config.files),
      },
    };
  }

  return {
    name: 'ngrx-stacklbitz-plugin',

    transform(src, id) {
      if (!id.includes('stackblitz.yml')) {
        return;
      }

      if (src.startsWith('export default')) {
        return src;
      }

      const parsed = parseYaml(src);
      const config = loadConfig(id, parsed as StackblitzConfig);

      return `export default ${JSON.stringify(config)};`;
    },
  };
}
