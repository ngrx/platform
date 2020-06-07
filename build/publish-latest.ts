import * as util from './util';
import { createBuilder } from './util';
import { Config, packages } from './config';
import * as shelljs from 'shelljs';

/**
 * Publish release to NPM on "latest" tag
 */
export async function publishToNpm(config: Config) {
  const publishablePackages = util
    .getTopLevelPackages(config)
    .filter((pkg) => !pkg.includes('component'));

  for (let pkg of publishablePackages) {
    console.log(`Publishing @ngrx/${pkg}`);

    const cmd = [
      './node_modules/.bin/bazel run',
      `//modules/${pkg}:npm_package.publish`,
      '--',
      '--access=public',
      '--tag=latest',
    ];

    shelljs.exec(cmd.join(' '));
  }
}

const publishLatest = createBuilder([
  ['Publish packages on latest', publishToNpm],
]);

publishLatest({
  scope: '@ngrx',
  packages,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
