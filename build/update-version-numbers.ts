import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import * as readline from 'readline';
import * as glob from 'glob';
import { createBuilder, writeAsJson, findAllModulePackageJsons } from './util';
import { packages } from './config';

// get the version from the command
// e.g. ts-node ./build/update-version-numbers.ts 10.0.0
const [newVersion] = process.argv.slice(2);

if (newVersion) {
  updateVersions(newVersion);
} else {
  // if no version is provided, ask for it
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`What's the new version? `, (version) => {
    rl.close();
    updateVersions(version);
  });
}

function updateVersions(version: string) {
  const update = createBuilder([
    ['Update package.json', createPackageJsonBuilder(version)],
    ['Update ng-add schematic', createUpdateAddSchematicBuilder(version)],
    ['Update docs version picker', createArchivePreviousDocsBuilder(version)],
  ]);

  update({
    scope: '@ngrx',
    packages,
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

function createPackageJsonBuilder(version: string) {
  return async () => {
    const packages = findAllModulePackageJsons();
    packages.map(({ pkg, path }) => {
      pkg.version = version;
      writeAsJson(path, pkg);
    });
  };
}

function createUpdateAddSchematicBuilder(version: string) {
  return async () => {
    glob
      .sync('**/libs-version.ts', { ignore: '**/node_modules/**' })
      .map((file) => {
        writeFileSync(
          file,
          `export const platformVersion = '^${version}';${EOL}`
        );
      });
  };
}

function createArchivePreviousDocsBuilder(version: string) {
  return async () => {
    // only deprecate previous version on MAJOR releases
    if (!version.endsWith('.0.0')) {
      return;
    }
    const path = './projects/ngrx.io/content/navigation.json';

    const [major] = version.split('.');
    const prevousVersion = Number(major) - 1;
    const content = readFileSync(path, 'utf-8');
    const navigation = JSON.parse(content);
    navigation['docVersions'] = [
      {
        title: `v${prevousVersion}`,
        url: `https://v${prevousVersion}.ngrx.io`,
      },
      ...navigation['docVersions'],
    ];
    writeAsJson(path, navigation);

    console.log(
      '\r\n⚠ Previous version added to website doc versions but site needs to be archived manually.'
    );
  };
}
