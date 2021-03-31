import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import * as readline from 'readline';
import * as glob from 'glob';
import { createBuilder } from './util';
import { packages } from './config';
import { join } from 'path';

const CONFIG = {
  navigationFile: './projects/ngrx.io/content/navigation.json',
  migrationDirectory: './projects/ngrx.io/content/guide/migration',
  currentVersion: JSON.parse(readFileSync('./package.json', 'utf-8')).version,
};

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
  const publishNext = createBuilder([
    ['Update package.json', createPackageJsonBuilder(version)],
    ['Update ng-add schematic', createUpdateAddSchematicBuilder(version)],
    ['Update docs version picker', createArchivePreviousDocsBuilder(version)],
    ['Create migration docs', createMigrationDocs(version)],
  ]);

  publishNext({
    scope: '@ngrx',
    packages,
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

/**
 * Updates package versions in package.json files
 * Updates peerDependencies versions of NgRx packages in package.json files
 */
function createPackageJsonBuilder(version: string) {
  const [major] = version.split('.');
  return async () => {
    glob
      .sync('**/package.json', { ignore: '**/node_modules/**' })
      .map((file) => {
        const content = readFileSync(file, 'utf-8');
        const pkg = JSON.parse(content);
        let saveFile = false;

        if (pkg?.version && pkg?.name?.startsWith('@ngrx')) {
          pkg.version = version;
          saveFile = true;
        }

        if (pkg?.peerDependencies) {
          Object.keys(pkg.peerDependencies).forEach((key) => {
            if (key.startsWith('@ngrx')) {
              pkg.peerDependencies[key] = version;
              saveFile = true;
            } else if (key.startsWith('@angular')) {
              // because the NgRx version is in sync with the Angular version
              // we can also update the Angular dependencies
              pkg.peerDependencies[key] = `^${major}.0.0`;
              saveFile = true;
            }
          });
        }

        if (saveFile) {
          writeAsJson(file, pkg);
        }
      });
  };
}

/**
 * Updates the platform version for our schematics
 */
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

/**
 * Creates an archive version (in the dropdown) on a major release
 */
function createArchivePreviousDocsBuilder(version: string) {
  return async () => {
    // only deprecate previous version on MAJOR releases
    if (!version.endsWith('.0.0')) {
      return;
    }
    const [major] = version.split('.');
    const previousVersion = Number(major) - 1;
    const content = readFileSync(CONFIG.navigationFile, 'utf-8');
    const navigation = JSON.parse(content);
    navigation['docVersions'] = [
      {
        title: `v${previousVersion}`,
        url: `https://v${previousVersion}.ngrx.io`,
      },
      ...navigation['docVersions'],
    ];
    writeAsJson(CONFIG.navigationFile, navigation);

    console.log(
      '\r\n⚠ Previous version added to website doc versions but site needs to be archived manually.'
    );
  };
}

/**
 * Creates a migration file when the major version changes
 * Also adds the new migration to the side navigation
 */
function createMigrationDocs(version: string) {
  return async () => {
    const [newMajor] = version.split('.');
    const [currentMajor] = CONFIG.currentVersion.split('.');

    if (newMajor === currentMajor) {
      return;
    }

    const navigationContent = readFileSync(CONFIG.navigationFile, 'utf-8');
    const navigation = JSON.parse(navigationContent);
    const migrationsNav = navigation['SideNav'].find(
      (nav: any) => nav.title === 'Migrations'
    );
    if (migrationsNav) {
      migrationsNav.children = [
        {
          title: `V${newMajor}`,
          url: `guide/migration/v${newMajor}`,
        },
        ...migrationsNav.children,
      ];
      writeAsJson(CONFIG.navigationFile, navigation);
    } else {
      console.log('\r\n ⚠ Not able to find Migrations in SideNav');
    }

    const migrationDocPath = join(CONFIG.migrationDirectory, `v${newMajor}.md`);

    console.log(
      `\r\n ✍   Please write a migration guide at ${migrationDocPath}`
    );
    const migrationPlaceholder = `# V${newMajor} Update Guide

## Angular CLI update

NgRx supports using the Angular CLI \`ng update\` command to update your dependencies. Migration schematics are run to make the upgrade smoother. These schematics will fix some of the breaking changes.

To update your packages to the latest released version, run the command below.

\`\`\`sh
ng update @ngrx/store
\`\`\`

## Dependencies

Version ${newMajor} has the minimum version requirements:

- Angular version TK
- Angular CLI version TK
- TypeScript version TK
- RxJS version TK

## Breaking changes

### @ngrx/store

TK
`;
    writeFileSync(migrationDocPath, migrationPlaceholder);
  };
}

function writeAsJson(path: string, json: object) {
  const content = JSON.stringify(json, null, 2);
  writeFileSync(path, `${content}${EOL}`);
}
