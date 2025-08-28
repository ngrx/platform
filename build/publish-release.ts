import { createBuilder } from './util';
import { packages } from './config';
import { execSync } from 'child_process';

const RELEASE_TAG = process.env.RELEASE_TAG;
const RELEASE_VERSION = process.env.RELEASE_VERSION;
const DRY_RUN = process.env.DRY_RUN === 'true';
const NPM_TOKEN = process.env.NPM_TOKEN;

/**
 * Publish release to NPM on "latest/next" tag
 */
export async function publishLatestToNpm() {
  if (!process.env.CI || !process.env.GITHUB_WORKFLOW) {
    throw new Error('Invalid release environment!');
  }

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

  execSync(`npm config set //registry.npmjs.org/:_authToken=${NPM_TOKEN}`);

  for (const pkg of publishablePackages) {
    console.log(
      `Publishing @ngrx/${pkg} ${RELEASE_VERSION} on ${RELEASE_TAG} with dry run set to ${DRY_RUN}`
    );

    const cmd = [
      'npm publish',
      `./dist/modules/${pkg}`,
      '--provenance',
      '--access=public',
      `--tag=${RELEASE_TAG}`,
      DRY_RUN ? `--dry-run` : '',
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
