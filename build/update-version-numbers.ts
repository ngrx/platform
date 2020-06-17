import { EOL } from 'os';
import { readFileSync, writeFileSync } from 'fs';
import * as glob from 'glob';
import * as readline from 'readline';

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
  [updatePackageJson, updateAddSchematic, archivePreviousDocs].forEach((m) =>
    m(version)
  );
}

function updatePackageJson(version: string) {
  glob.sync('**/package.json', { ignore: '**/node_modules/**' }).map((file) => {
    const content = readFileSync(file, 'utf-8');
    const pkg = JSON.parse(content);
    if (pkg?.version && pkg?.name?.startsWith('@ngrx')) {
      pkg.version = version;
      writeAsJson(file, pkg);
    }
  });

  console.log('✔ Version updated in package.json files.');
}

function updateAddSchematic(version: string) {
  glob
    .sync('**/libs-version.ts', { ignore: '**/node_modules/**' })
    .map((file) => {
      writeFileSync(
        file,
        `export const platformVersion = '^${version}';${EOL}`
      );
    });

  console.log('✔ Version updated for ng-add schematics.');
}

function archivePreviousDocs(version: string) {
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
    '⚠ Previous version added to website doc versions but site needs to be archived manually.'
  );
}

function writeAsJson(path: string, json: object) {
  const content = JSON.stringify(json, null, 2);
  writeFileSync(path, `${content}${EOL}`);
}
