import { createBuilder } from './util';
import { packages } from './config';
import { execSync } from 'child_process';

const RELEASE_TAG = process.env.RELEASE_TAG;
const DRY_RUN = process.env.DRY_RUN !== 'false';

/**
 * Publish release to NPM on "latest" tag
 */
export async function publishLatestToNpm() {
  const publishablePackages = [
    'store',
    'effects',
    'router-store',
    'store-devtools',
    'entity',
    'component-store',
    'component',
    'schematics',
    'eslint-plugin',
    'data',
    'signals',
    'operators',
  ];

  execSync(
    `npm config set //registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`
  );

  for (let pkg of publishablePackages) {
    console.log(
      `Publishing @ngrx/${pkg} on ${RELEASE_TAG} with dry run set to ${DRY_RUN}`
    );

    const cmd = [
      'npm publish',
      `./dist/modules/${pkg}`,
      '--access=public',
      `--tag=${RELEASE_TAG}`,
      DRY_RUN ? `--dry-run` : '--dry-run',
    ];

    execSync(cmd.join(' '));
  }
}

const publishLatest = createBuilder([
  ['Publish packages on latest\n', publishLatestToNpm],
]);

publishLatest({
  scope: '@ngrx',
  packages,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
