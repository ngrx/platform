import { createBuilder } from './util';
import { packages } from './config';
import * as shelljs from 'shelljs';

/**
 * Publish release to NPM on "next" tag
 */
export async function publishNextToNpm() {
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

  for (let pkg of publishablePackages) {
    console.log(`Publishing @ngrx/${pkg}`);

    const cmd = [
      'npm publish',
      `./dist/modules/${pkg}`,
      '--access=public',
      '--tag=next',
    ];

    shelljs.exec(cmd.join(' '));
  }
}

const publishNext = createBuilder([
  ['Publish packages on next\n', publishNextToNpm],
]);

publishNext({
  scope: '@ngrx',
  packages,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
