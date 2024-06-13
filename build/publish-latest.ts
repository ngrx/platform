import { createBuilder } from './util';
import { packages } from './config';
import * as shelljs from 'shelljs';

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
    // 'signals',
    'operators',
  ];

  for (let pkg of publishablePackages) {
    console.log(`Publishing @ngrx/${pkg}`);

    const cmd = [
      'npm publish',
      `./dist/modules/${pkg}`,
      '--access=public',
      '--tag=latest',
    ];

    shelljs.exec(cmd.join(' '));
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
