import * as util from './util';
import { createBuilder } from './util';
import { Config, packages } from './config';
import * as shelljs from 'shelljs';

/**
 * Publish release to NPM on "next" tag
 */
export async function publishNextToNpm(config: Config) {
  for (let pkg of util.getTopLevelPackages(config)) {
    console.log(`Publishing @ngrx/${pkg}`);

    const cmd = [
      './node_modules/.bin/bazel run',
      `//modules/${pkg}:npm_package.publish`,
      '--',
      '--access=public',
      '--tag=next',
    ];

    shelljs.exec(cmd.join(' '));
  }
}

const publishNext = createBuilder([
  ['Publish packages on next', publishNextToNpm],
]);

publishNext({
  scope: '@ngrx',
  packages,
}).catch(err => {
  console.error(err);
  process.exit(1);
});
