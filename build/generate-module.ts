import { resolve, sep, join } from 'path';
import { readFileSync, writeFileSync, promises } from 'fs';
import { cwd } from 'process';
import * as readline from 'readline';
import * as fsExtra from 'fs-extra';
import { packages, modulesDir } from './config';
import * as tasks from './tasks';
import { createBuilder, writeAsJson, findAllModulePackageJsons } from './util';
import { dasherize } from '../modules/schematics-core/utility/strings';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  `What's the name of the module? (the @ngrx prefix will be automatically added) `,
  (name) => {
    rl.question(`What's the kebab name of the module? `, (kebab) => {
      rl.question(`What's the description of the module? `, (description) => {
        rl.close();
        generate({ name, kebab, description });
      });
    });
    // default value for the question
    rl.write(dasherize(name));
  }
);

export function generate(config: ModuleConfig) {
  const createModule = createBuilder([
    ['Generating module', createGenerateBuilder(config)],
    ['Copy schematic core files', tasks.copySchematicsCore],
    ['Update tsconfig file', addModuleToTsConfigBuilder(config)],
    [
      'Update package.json schematic groups',
      updatePackageGroupsBuilder(config),
    ],
    ['Log manual tasks', logManualTasks],
  ]);

  createModule({
    scope: '@ngrx',
    packages: [...packages, { name: config.kebab }],
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

function createGenerateBuilder(config: ModuleConfig) {
  return async () => {
    for await (const f of getFiles('./build/new-module')) {
      const content = readFileSync(f, 'utf-8');
      const [, , , ...path] = f
        .replace(cwd(), '')
        .replace()
        .split(sep) as string[];

      const newContent = content
        .replace(/{{MODULE_NAME}}/g, config.name)
        .replace(/{{MODULE_NAME_KEBAB}}/g, config.kebab)
        .replace(/{{MODULE_DESCRIPTION}}/g, config.description);
      const newPath = join(modulesDir, config.kebab, ...path);
      fsExtra.ensureFileSync(newPath);
      writeFileSync(newPath, newContent);
    }
  };
}

async function logManualTasks() {
  console.log(
    '⬜ Add package to BAZEL scoped packages (https://github.com/ngrx/platform/blob/master/tools/defaults.bzl)'
  );
  console.log(
    '⬜ Add scope to CONTRIBUTING.md (https://github.com/ngrx/platform/blob/master/CONTRIBUTING.md#scope)'
  );
  console.log(
    '⬜ Add page (and navigation) to docs (https://github.com/ngrx/platform/tree/master/projects/ngrx.io/content)'
  );
  console.log(
    '⬜ Add nightly build info (https://github.com/ngrx/platform/blob/master/projects/ngrx.io/content/guide/nightlies.md)'
  );
  console.log(
    '⬜ Add package to marketing (https://github.com/ngrx/platform/blob/master/projects/ngrx.io/content/marketing/docs.md#packages)'
  );
  console.log('⬜ Create repository for build artifacts');
}

function addModuleToTsConfigBuilder(config: ModuleConfig) {
  return async () => {
    const content = readFileSync('./tsconfig.json', 'utf-8');
    const tsConfig = JSON.parse(content);
    tsConfig['compilerOptions']['paths'][`@ngrx/${config.kebab}`] = [
      `${modulesDir}${config.kebab}`,
    ];
    writeAsJson('./tsconfig.json', tsConfig);
  };
}

function updatePackageGroupsBuilder(config: ModuleConfig) {
  return async () => {
    const packages = findAllModulePackageJsons();
    packages.map(({ path, pkg }) => {
      console.log(JSON.stringify(pkg['ng-update']));
      if (pkg['ng-update'] && pkg['ng-update']['packageGroup']) {
        pkg['ng-update']['packageGroup'] = [
          ...pkg['ng-update']['packageGroup'],
          `@ngrx/${config.kebab}`,
        ];
        writeAsJson(path, pkg);
      }
    });
  };
}

async function* getFiles(dir: string): any {
  const dirents = await promises.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

interface ModuleConfig {
  name: string;
  kebab: string;
  description: string;
}
